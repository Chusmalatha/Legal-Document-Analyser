from config import get_llm

def detect_risks(text: str):

    llm = get_llm()

    prompt = f"""
You are a Legal Risk Analyzer.

Your job is to read the legal document and identify the **most important risks** that could affect the user.

Rules:
- A risk is something the user is restricted from doing, a legal obligation, a penalty, or anything that can cause legal problems.
- Only return **up to 5 risks**.
- Each risk should be **one simple sentence**.
- Use **very simple English**, easy for a normal person to understand.
- Do NOT return the original sentence from the document.
- **Do not create extra risks**; only the real ones present in the text.
- Return only the risk statements, nothing else.

Format exactly like this:

Risk: <simple explanation of the risk>
Risk: <simple explanation of the risk>
...

Document:
{text}
"""

    response = llm.invoke(prompt)

    return response.content