from langgraph.graph import START , StateGraph , END
from rag_core.agents.state import AgentState
from rag_core.agents.analyst import get_analyst_agent
from rag_core.agents.hallucination_checker import get_hallucination_checker
from rag_core.agents.quiz_creator import get_quiz_agent
from rag_core.agents.researcher import research_query

analyst = get_analyst_agent()
hallucination_checker = get_hallucination_checker()
quiz_agent = get_quiz_agent()


def analyze_topic(state : AgentState):
    topic = state["topic"]
    result = analyst.invoke({"topic": topic})
    return {"sub_topics": result.sub_topics}

def research_topic(state : AgentState):
    sub_topics = state["sub_topics"]
    user_id = state["user_id"]

    persist_path = f"./data/users/{user_id}/chroma_db"
    documents = research_query(sub_topics , persist_path)
    return {"documents": documents}

def generate_quiz(state : AgentState):
    limit = state.get("limit", 5)
    documents = state["documents"]
    context_str = "\n\n".join([doc.page_content for doc in documents])

    result = quiz_agent.invoke({"topic" : state["topic"] , "context" : context_str , "limit" : limit})
    
    return {"quiz": result.questions}

def validate_quiz(state : AgentState):
    quiz = state["quiz"]

    documents = state["documents"]
    context_str = "\n\n".join([doc.page_content for doc in documents])
    result = hallucination_checker.invoke({"quiz": quiz , "context" : context_str})
    
    # Increment retries
    current_retries = state.get("retries", 0)
    print(f"---HALLUCINATION CHECK: Grounded={result.is_grounded}")
    return {"hallucinations": not result.is_grounded, "retries": current_retries + 1}

def route_quiz(state : AgentState):
    if state["hallucinations"]:
        if state.get("retries", 0) >= 1:
             print("---DECISION: Max retries reached, stopping loop")
             return END
             
        print("---DECISION: Hallucination detected, re-creating quiz")
        return "creator"
    else:
        print("---DECISION: Quiz is valid")
        return END

workflow = StateGraph(AgentState)

workflow.add_node("analyst" , analyze_topic)
workflow.add_node("researcher" , research_topic)
workflow.add_node("creator" , generate_quiz)
workflow.add_node("validator" , validate_quiz)



workflow.add_edge(START , "analyst")
workflow.add_edge("analyst" , "researcher")
workflow.add_edge("researcher" , "creator")
workflow.add_edge("creator" , "validator")
# workflow.add_edge("validator" , END)
workflow.add_conditional_edges(
    "validator" ,
    route_quiz,
    {
        "creator": "creator",
        END: END
    }
)

app = workflow.compile()


