import asyncio
import websockets
import time
import sys

async def test_conversation():
    uri = "ws://localhost:8004/ws/12345"
    print(f"[{time.strftime('%X')}] Connecting to {uri}...")
    
    try:
        async with websockets.connect(uri) as websocket:
            print(f"[{time.strftime('%X')}] Connected!")
            
            # Message 1: Trigger the proactive flow (Expect [WAIT])
            message = "Find me the cheapest flight to San Jose from 12/24-12/31. I have no budget limit, just find me the best deal."
            print(f"[{time.strftime('%X')}] User: {message}")
            await websocket.send(message)
            
            # Wait for responses
            print(f"[{time.strftime('%X')}] Waiting for responses...")
            
            # We expect an immediate response, and then a delayed one (Follow-up)
            start_time = time.time()
            response_count = 0
            
            while True:
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=15.0)
                    print(f"[{time.strftime('%X')}] Agent: {response}")
                    response_count += 1
                    
                    # If we received the follow-up (heuristic: contains price or "found"), we can stop or continue
                    if response_count >= 2:
                        print(f"[{time.strftime('%X')}] Received expected follow-up!")
                        break
                        
                except asyncio.TimeoutError:
                    print(f"[{time.strftime('%X')}] Timeout waiting for response.")
                    break
            
            print(f"[{time.strftime('%X')}] Test Complete.")

    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_conversation())
