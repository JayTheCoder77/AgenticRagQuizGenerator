from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel , Field
from typing import List
import os
from dotenv import load_dotenv
load_dotenv()
class AnalystOutput(BaseModel):
    sub_topics : List[str] = Field(description="List of 3-5 specific search queries based on the topic")

def get_analyst_agent():
    llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0 , google_api_key = os.getenv("GEMINI_API_KEY"))
    structured_llm = llm.with_structured_output(AnalystOutput)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert research analyst. Given a topic, break it down into 3-5 distinct sub-topics for a comprehensive quiz. Return ONLY the list."),
        ("human", "Topic: {topic}")
    ])

    analyst_agent = prompt | structured_llm
    return analyst_agent