from langchain_community.vectorstores import FAISS
from langchain_classic.chains import ConversationalRetrievalChain
from langchain_classic.memory import ConversationBufferMemory
from langchain_core.prompts import PromptTemplate

from services.embeddings import get_embeddings
from config import get_llm

qa_chain = None


def create_vector_store(chunks):

    embeddings = get_embeddings()

    vectorstore = FAISS.from_documents(
        chunks,
        embeddings
    )

    return vectorstore


def create_rag_chain(vectorstore):

    global qa_chain

    llm = get_llm()

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4}
    )

    memory = ConversationBufferMemory(
        memory_key="chat_history",
        return_messages=True
    )

    # Custom Prompt

    prompt = PromptTemplate(
        input_variables=["context", "question"],
        template="""You are a highly intelligent, friendly AI Legal Assistant.

IMPORTANT RULES FOR YOUR BEHAVIOR:
1. GREETINGS & CASUAL CHAT: If the user says "hello", "hi", "nice to meet you", "thank you", "what are you doing", etc., reply naturally and conversationally. DO NOT summarize the document. DO NOT say "You uploaded a document". Just reply warmly like a human assistant.
2. ANSWERING QUESTIONS: When the user asks a question about the document (like asking for a summary, risks, or clauses), use the DOCUMENT CONTEXT below to answer accurately. 
3. BE CONCISE AND VARIED: Keep your answers short and clear. DO NOT start your sentences with "The document appears to be..." or "I'm here to help you understand...". Do not repeat the same phrases.
4. If you cannot find the answer in the context, just say "I couldn't find that in the document."

Document Context:
{context}

User Question:
{question}

Helpful Answer:"""
    )


    qa_chain = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=retriever,
        memory=memory,
        combine_docs_chain_kwargs={"prompt": prompt}
    )

    return qa_chain


def ask_question(question: str):

    global qa_chain

    if qa_chain is None:
        return "Please upload a document first."

    result = qa_chain.invoke({
        "question": question
    })

    return result["answer"]