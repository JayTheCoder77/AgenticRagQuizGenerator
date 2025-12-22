from typing import List
from langchain_core.documents import Document
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader

def load_documents(directory_path: str) -> List[Document]:
    loader = DirectoryLoader(directory_path, glob="**/*.pdf", loader_cls=PyPDFLoader , show_progress=True)
    return loader.load()