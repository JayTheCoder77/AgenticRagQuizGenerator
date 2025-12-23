from rag_core.graph.workflow import app

topic = "capital budgeting"

results = app.invoke({"topic": topic})

print(results["quiz"])
print(results["hallucinations"])
