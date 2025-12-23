from typing import List
from langchain_core.documents import Document
from rag_core.ingestion.vectorstore import get_vector_store

def research_query(sub_topics : List[str]) -> List[Document]:
    vectorstore = get_vector_store()
    all_docs = []

    for topic in sub_topics:
        results = vectorstore.similarity_search(topic, k=3)
        all_docs.extend(results)
    
    unique_content = set()
    cleaned_docs = []
    for doc in all_docs:
        if doc.page_content not in unique_content:
            unique_content.add(doc.page_content)
            cleaned_docs.append(doc)
    return cleaned_docs