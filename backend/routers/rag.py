from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from backend.auth.utils import SECRET_KEY, ALGORITHM
from backend import schemas
import os
import shutil

# RAG Imports
from rag_core.ingestion.loader import load_documents
from rag_core.ingestion.splitter import split_documents
from rag_core.ingestion.vectorstore import create_vector_store
from rag_core.graph.workflow import app

router = APIRouter(prefix="/rag", tags=["rag"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/upload")
def upload_file(file: UploadFile = File(...), user_email: str = Depends(get_current_user)):
    # Define paths
    # Sanitize email for path (replace special chars if needed, though most OS support @)
    # Ideally use user ID from DB, but email works for now if unique
    
    user_dir = f"data/users/{user_email}"
    inputs_dir = os.path.join(user_dir, "inputs")
    chroma_dir = os.path.join(user_dir, "chroma_db")
    
    # CLEAR EXISTING DATA: Ensure fresh context for each upload
    if os.path.exists(inputs_dir):
        shutil.rmtree(inputs_dir)
    if os.path.exists(chroma_dir):
        shutil.rmtree(chroma_dir)
        
    os.makedirs(inputs_dir, exist_ok=True)
    
    # Save file
    file_path = os.path.join(inputs_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    # Run Ingestion
    # We load ONLY from this user's input directory
    docs = load_documents(inputs_dir)
    chunks = split_documents(docs)
    
    # Create valid vector store in user's specific directory
    create_vector_store(chunks, persist_directory=chroma_dir)
    
    return {"message": "Ingestion complete", "chunks": len(chunks)}

@router.post("/quiz")
def generate_quiz(request: schemas.QuizRequest, user_email: str = Depends(get_current_user)):
    # Run the graph
    # Pass user_email as user_id so it picks up the right vector store
    inputs = {"topic": request.topic, "limit": request.limit, "user_id": user_email}
    
    result = app.invoke(inputs)
    
    return {
        "quiz": result["quiz"],
        "hallucinations": result["hallucinations"]
    }
