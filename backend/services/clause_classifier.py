from config import get_llm

def classify_clauses(text: str):

    llm = get_llm()

    text = text[:12000]

    prompt = f"""
You are a Legal Document Classifier.

Your task is to identify the MAIN legal clause category of the entire document.

Read the whole document and determine the dominant legal purpose.

Possible clause types:
- Copyright Transfer Clause
- Copyright Clause
- Licensing Clause
- NDA Clause
- Employment Clause
- Service Agreement Clause
- Publishing Agreement Clause
- Confidentiality Clause
- Data Protection Clause
- Liability Clause
- Partnership Clause
- Intellectual Property Clause

Rules:
- Choose the clause that best represents the overall purpose.
- If ownership of work is transferred to a publisher, choose "Copyright Transfer Clause".
- Return ONLY the clause name.
- Do NOT explain anything.
- Output must contain ONLY the clause type.

Example outputs:
Copyright Transfer Clause
NDA Clause
Service Agreement Clause

Document:
{text}
"""

    response = llm.invoke(prompt)

    return response.content.strip()