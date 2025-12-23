from rag_core.agents.quiz_creator import get_quiz_agent

context = "React uses a virtual DOM. The 'useEffect' hook handles side effects. Components can be functional or class-based."

topic = "React Basics"

agent = get_quiz_agent()

quiz = agent.invoke({"context": context, "topic": topic})

for ques in quiz.questions:
    print(ques.question)
    print(ques.options)
    print(ques.answer)
    print("\n")

