from fastapi import APIRouter , HTTPException , Depends , status
from fastapi.security import OAuth2PasswordRequestForm , OAuth2PasswordBearer
from backend import schemas
from backend.database import create_connection , init_db
from backend.auth.utils import create_access_token , verify_password , get_password_hash

router = APIRouter(prefix="/auth", tags=["auth"])

init_db()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
def signup(user: schemas.UserCreate):
    conn = create_connection()
    cursor = conn.cursor()
    
    # check if user already exists
    cursor.execute("SELECT * FROM users WHERE email = ?", (user.email,))
    existing_user = cursor.fetchone()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    
    hashed_pwd = get_password_hash(user.password)
    
    cursor.execute("INSERT INTO users (email, hashed_password) VALUES (?, ?)", (user.email, hashed_pwd))
    conn.commit()
    conn.close()
    return {"message": "User created successfully"}

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # OAuth2PasswordRequestForm has .username and .password fields
    # We treat .username as the email
    conn = create_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE email = ?", (form_data.username,))
    user = cursor.fetchone()
    conn.close()
    if not user or not verify_password(form_data.password , user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password" , headers={"WWW-Authenticate": "Bearer"})
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}
