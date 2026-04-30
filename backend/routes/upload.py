import os
from fastapi import APIRouter, UploadFile, File

from services.document_loader import load_pdf
from services.summarizer import summarize
from services.clause_classifier import classify_clauses
from services.risk_detector import detect_risks
from services.chunking import split_documents
from services.rag_pipeline import create_vector_store, create_rag_chain
router = APIRouter(prefix="/upload")

UPLOAD_DIR = "uploads"


@router.post("/")
async def upload_document(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    documents = load_pdf(file_path)

    full_text = "\n".join([doc.page_content for doc in documents])

    summary = summarize(full_text)

    clause = classify_clauses(full_text)

    risks = detect_risks(full_text)

    chunks = split_documents(documents)

    from langchain_core.documents import Document
    insights_text = f"Document Summary:\n{summary}\n\nDocument Clause Type:\n{clause}\n\nDocument Risks:\n{risks}"
    chunks.insert(0, Document(page_content=insights_text, metadata={"source": "analysis"}))

    vectorstore = create_vector_store(chunks)

    create_rag_chain(vectorstore)

    return {
        "summary": summary,
        "clause_type": clause,
        "risk_sentences": risks
    }