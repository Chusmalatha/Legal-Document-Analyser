from config import get_llm

def summarize(text: str, question: str = "Please provide a concise summary of this document."):

    llm = get_llm()

    # Prevent extremely large prompts
    text = text[:12000]

    prompt = f"""
You are an AI Legal Assistant that helps users understand legal documents in a simple and clear way.

Rules:
- Answer ONLY using the provided document context.
- Do NOT make up information.
- Keep answers SHORT, CLEAR, and DIRECT.
- Use SIMPLE ENGLISH (avoid complex legal terminology).
- Be conversational and natural.

Important:
- Do NOT repeat the same sentence again and again.
- Avoid always starting with "The document appears to be..."
- Rephrase answers if the same question is asked again.
- If user asks to simplify, explain like to a beginner.
- If asked about risks, provide bullet points.
- If information is not present, say: "I couldn't find that in the document."

Context:
{text}

Question:
{question}
"""

    response = llm.invoke(prompt)

    return response.content