from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any
from dotenv import load_dotenv
import uvicorn
from app.llm_chain import LLMChain

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Helpdesk Assistant API",
    description="A mini helpdesk assistant powered by LLM for intent classification and conversation.",
)

# CORS setup
origins = ["http://localhost", "http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLMChain
try:
    llm_chain = LLMChain()
except Exception as e:
    print(f"Error initializing LLMChain: {e}")
    llm_chain = None

# ------------------------------
# Pydantic Models
# ------------------------------
class AskRequest(BaseModel):
    question: str
    session_id: str = "default"  # Default session if not provided

class AskResponse(BaseModel):
    intent: str
    result: str
    debug_info: Dict[str, Any] = {}

class FeedbackRequest(BaseModel):
    question: str
    identified_intent: str
    actual_intent: str
    was_correct: bool

class IntentListResponse(BaseModel):
    supported_intents: List[str]

# ------------------------------
# API Endpoints
# ------------------------------
@app.post("/ask", response_model=AskResponse)
async def ask_assistant(request_data: AskRequest):
    if not llm_chain:
        raise HTTPException(status_code=500, detail="LLM service not initialized.")

    user_question = request_data.question
    session_id = request_data.session_id

    try:
        intent_response = await llm_chain.run_chain(user_question, session_id=session_id)
        result_message = intent_response.get("response", "")
        debug_info = {
            "original_question": user_question,
            "llm_reasoning": intent_response.get("reasoning", ""),
        }

        return AskResponse(
            intent=intent_response.get("intent", "unknown"),
            result=result_message,
            debug_info=debug_info
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@app.get("/intents", response_model=IntentListResponse)
async def get_supported_intents():
    if not llm_chain:
        raise HTTPException(status_code=500, detail="LLM service not initialized.")
    return IntentListResponse(supported_intents=llm_chain.get_supported_intents())

@app.post("/feedback")
async def submit_feedback(feedback_data: FeedbackRequest):
    print(f"Feedback Received: {feedback_data.dict()}")
    return {"message": "Feedback received successfully!"}

# ------------------------------
# Start server
# ------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
