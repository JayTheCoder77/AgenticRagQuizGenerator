from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel , Field
from typing import List

class AnalystOutput(BaseModel):
    sub_topics : List[str] = Field(description="List of 3-5 specific search queries based on the topic")

def get_analyst_agent():
    llm = ChatOllama(model="qwen2.5:3b" , temperature=0)
    structured_llm = llm.with_structured_output(AnalystOutput)
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert research analyst. Given a topic, break it down into 3-5 distinct sub-topics for a comprehensive quiz. Return ONLY the list."),
        ("human", "Topic: {topic}")
    ])

    analyst_agent = prompt | structured_llm
    return analyst_agent