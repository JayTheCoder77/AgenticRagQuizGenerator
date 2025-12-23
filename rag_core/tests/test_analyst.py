from rag_core.agents.analyst import get_analyst_agent

def main():
    analyst_agent = get_analyst_agent()
    
    # invoke chain with topic
    result = analyst_agent.invoke({"topic": "React Hooks"})

    print("sub topics generated")
    for topic in result.sub_topics:
        print(f"- {topic}")

if __name__ == "__main__":
    main()