from fastapi import FastAPI
from backend.routers import auth, rag
import uvicorn

app = FastAPI(title="Agentic RAG API")

# Include Routers
app.include_router(auth.router)
app.include_router(rag.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Agentic RAG API"}

if __name__ == "__main__":
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
