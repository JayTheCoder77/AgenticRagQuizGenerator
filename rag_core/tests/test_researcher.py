from rag_core.agents.researcher import research_query

def main():
    sub_topics = ["finance principles", "investment strategies"]
    docs = research_query(sub_topics)
    print(f"Found {len(docs)} documents")
    if docs:
        print("--- First Document ---")
        print(docs[0].page_content[:200]) # First 200 chars
        print(docs[0].metadata)

if __name__ == "__main__":
    main()