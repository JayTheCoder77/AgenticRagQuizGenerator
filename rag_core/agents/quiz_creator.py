from pydantic import BaseModel
from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from typing import List

class Question(BaseModel):
    question: str
    options: List[str]
    answer: str

class Quiz(BaseModel):
    questions: List[Question]

def get_quiz_agent():
    llm = ChatOllama(model="qwen2.5:3b" , temperature=0)
    structured_llm = llm.with_structured_output(Quiz)
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system" , "You are a teacher. Create a multiple-choice quiz based ONLY on the provided context."),
            ("human" , "Topic: {topic}\nContext: {context}")
        ]
    )
    quiz_agent = prompt | structured_llm
    return quiz_agent