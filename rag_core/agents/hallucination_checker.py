from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from typing import List
from pydantic import BaseModel
import os
from dotenv import load_dotenv
load_dotenv()

class HallucinationGrade(BaseModel):
    is_grounded: bool
    explanation: str

def get_hallucination_checker():
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite" , temperature=0 , google_api_key = os.getenv("GEMINI_API_KEY"))
    structured_llm = llm.with_structured_output(HallucinationGrade)
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system" , "You are a grader. You will be given a set of quiz questions and a set of facts (context). Determine if the questions and answers are supported by the facts. If ANY part is unsupported, return False."),
            ("human" , "Quiz: {quiz}\nContext: {context}")
        ]
    )
    hallucination_checker = prompt | structured_llm
    return hallucination_checker