from rag_core.agents.hallucination_checker import get_hallucination_checker

def main():
    agent = get_hallucination_checker()

    # is_grounded: True
    # quiz = "What color is the sky? (A) Blue (B) Red. Answer: A"
    # context = "sky is blue"

    # is_grounded: False
    quiz = "Who was the first president of the USA? (A) Washington (B) Obama. Answer: A"
    context = "sky is blue"
    result = agent.invoke({"quiz": quiz, "context": context})
    print(result)

if __name__ == "__main__":
    main()
