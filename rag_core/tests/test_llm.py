from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv
load_dotenv()
llm = ChatGoogleGenerativeAI(model="gemma-3-27b-it", temperature=0.7 , google_api_key = os.getenv("GEMINI_API_KEY"))
response = llm.invoke("Explain RAG systems briefly.")
print(response.content) 