import os
from typing import List
from langchain_core.documents import Document
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

PERSIST_DIRECTORY = "./data/chroma_db"

def get_embedding_function():
    return HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def create_vector_store(documents: List[Document] , collection_name: str):
    embedding_function = get_embedding_function()
    vector_store = Chroma.from_documents(documents, embedding_function, persist_directory=PERSIST_DIRECTORY, collection_name=collection_name)
    return vector_store

def get_vector_store(collection_name: str):
    embedding_function = get_embedding_function()
    vector_store = Chroma(persist_directory=PERSIST_DIRECTORY, collection_name=collection_name, embedding_function=embedding_function)
    return vector_store
