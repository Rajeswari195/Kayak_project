from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.get("/")
async def get():
    return {"message": "AI Recommendation Service Running"}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        from agents.concierge_agent import agent
        # Keep track of the idle task
        idle_task = None

        while True:
            data = await websocket.receive_text()
            
            # Cancel existing idle task if any
            if idle_task:
                idle_task.cancel()
                
            response = agent.process_message(data)
            
            # Check for [WAIT] tag
            if "[WAIT]" in response:
                # Remove tag from message sent to user
                clean_response = response.replace("[WAIT]", "").strip()
                await manager.broadcast(clean_response)
                
                # Schedule follow-up (Proactive)
                async def send_followup():
                    await asyncio.sleep(5) 
                    followup_msg = agent.generate_followup()
                    await manager.broadcast(followup_msg)
                
                asyncio.create_task(send_followup())
            else:
                await manager.broadcast(response)
                
                # Schedule Nudge (Idle Timer)
                async def send_nudge():
                    try:
                        await asyncio.sleep(30) # Wait 30 seconds for user input
                        nudge_msg = agent.generate_nudge()
                        await manager.broadcast(nudge_msg)
                    except asyncio.CancelledError:
                        pass # Task was cancelled because user replied

                idle_task = asyncio.create_task(send_nudge())
    except WebSocketDisconnect:
        manager.disconnect(websocket)
