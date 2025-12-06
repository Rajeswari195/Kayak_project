import os
import google.generativeai as genai
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class TripRequest(BaseModel):
    destination: str
    budget: Optional[float] = None
    dates: Optional[str] = None
    preferences: List[str] = []

class ConciergeAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.0-flash')
            self.chat = self.model.start_chat(history=[])
        else:
            print("WARNING: GEMINI_API_KEY not found. Agent will be in dummy mode.")
            self.model = None

    def process_message(self, message: str) -> str:
        if not self.model:
            return "I'm currently in offline mode because my API key is missing. Please provide a GEMINI_API_KEY to unlock my full potential!"

        try:
            # Context for the travel agent persona
            system_prompt = """
            You are a helpful and enthusiastic travel concierge for a Kayak-like travel app. 
            Your goal is to help users plan trips, find deals, and book flights/hotels.
            
            When a user asks for a trip (e.g., "Plan a trip to Paris"), ask for missing details like dates, budget, and preferences if not provided.
            If they provide details, summarize them and suggest a few options (mock options are fine for now).
            
            IMPORTANT: 
            1. If you tell the user you are checking prices or availability and need a moment, append the tag [WAIT] at the end of your response.
            2. DO NOT use the [WAIT] tag if you are just asking the user a question or waiting for their input. Only use it when YOU are doing a "long" task.
            3. When asking the user for information (like dates, budget, preferences), ALWAYS use a bulleted list. Each question should be a separate bullet point.
            
            Keep your responses concise, friendly, and professional.
            """
            
            # Send message to Gemini
            response = self.chat.send_message(f"{system_prompt}\n\nUser: {message}")
            return response.text
        except Exception as e:
            import traceback
            print(f"Error calling Gemini: {e}")
            traceback.print_exc()
            return f"I'm having trouble connecting to my brain right now. Error: {str(e)}"

    def generate_followup(self) -> str:
        if not self.model:
            return "I'm back! I found some great options for you."
            
        try:
            # Prompt for the follow-up message
            response = self.chat.send_message("You previously asked the user to wait while you checked prices. Now, act as if a minute has passed. Provide the specific flight and hotel details with pricing (mock data) and ask if they want to proceed with booking.")
            return response.text
        except Exception as e:
            print(f"Error generating follow-up: {e}")
            return "I have the details ready. Shall we proceed?"

    def generate_nudge(self) -> str:
        if not self.model:
            return "Are you still there? I can help you find great deals!"
            
        try:
            # Prompt for the nudge message
            response = self.chat.send_message("The user hasn't responded for a while. Generate a short, friendly, and polite 'nudge' message asking if they are still interested or if they need more help. Do not be pushy.")
            return response.text
        except Exception as e:
            print(f"Error generating nudge: {e}")
            return "Just checking in - let me know if you have any other questions!"

agent = ConciergeAgent()
print(f"DEBUG: ConciergeAgent initialized. API Key present: {bool(agent.api_key)}")

