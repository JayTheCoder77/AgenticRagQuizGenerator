from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import List
import os
from dotenv import load_dotenv
load_dotenv()

class Question(BaseModel):
    question: str
    options: List[str]
    answer: str

class Quiz(BaseModel):
    questions: List[Question]

def get_quiz_agent():
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite" , temperature=0 , google_api_key = os.getenv("GEMINI_API_KEY"))
    structured_llm = llm.with_structured_output(Quiz)
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system" , "You are a teacher. Create a multiple-choice quiz with {limit} questions based STRICTLY on the provided context. \n\nRULES:\n1. If the info is not in the context, DO NOT create a question about it.\n2. The 'answer' field MUST BE an EXACT copy of one of the 'options'.\n3. Do not use outside knowledge."),
            ("human" , "Topic: {topic}\nContext: {context}")
        ]
    )
    quiz_agent = prompt | structured_llm
    return quiz_agent