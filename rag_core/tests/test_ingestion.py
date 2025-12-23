from rag_core.ingestion.loader import load_documents
from rag_core.ingestion.splitter import split_documents
from rag_core.ingestion.vectorstore import create_vector_store

def main():
    documents = load_documents("./data/inputs")
    chunks = split_documents(documents)
    
    # NEW: Print total number of chunks
    print(f"Total chunks created: {len(chunks)}")
    
    # NEW: Print the first chunk to see what it looks like
    if len(chunks) > 0:
        print("--- Chunk 1 Content ---")
        print(chunks[0].page_content)
        print("--- Chunk 1 Metadata ---")
        print(chunks[0].metadata)
        print("-----------------------")

    vector_store = create_vector_store(chunks)
    print(vector_store)

if __name__ == "__main__":
    main()
