from langchain_ollama import ChatOllama
from langchain_core.prompts import ChatPromptTemplate
from typing import List
from pydantic import BaseModel

class HallucinationGrade(BaseModel):
    is_grounded: bool
    explanation: str

def get_hallucination_checker():
    llm = ChatOllama(model="qwen2.5:3b" , temperature=0)
    structured_llm = llm.with_structured_output(HallucinationGrade)
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system" , "You are a grader. You will be given a set of quiz questions and a set of facts (context). Determine if the questions and answers are supported by the facts. If ANY part is unsupported, return False."),
            ("human" , "Quiz: {quiz}\nContext: {context}")
        ]
    )
    hallucination_checker = prompt | structured_llm
    return hallucination_checker