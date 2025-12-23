from typing import TypedDict, List
from langchain_core.documents import Document
class AgentState(TypedDict):
    topic : str
    limit : int
    sub_topics : List[str]
    documents : List[Document]
    quiz : List[dict]
    hallucinations : bool
    user_id : str
    retries : int
    