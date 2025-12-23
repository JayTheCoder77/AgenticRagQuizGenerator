from pydantic import BaseModel , EmailStr

class UserCreate(BaseModel):
    email : EmailStr
    password : str

class UserLogin(BaseModel):
    email : EmailStr
    password : str

class Token(BaseModel):
    access_token : str
    token_type : str

class QuizRequest(BaseModel):
    topic: str
    limit: int = 5