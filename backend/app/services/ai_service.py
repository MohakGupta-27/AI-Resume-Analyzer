# app/services/ai_service.py
import json
from openai import OpenAI
from fastapi import HTTPException, status # type: ignore
from app.config import settings

client = OpenAI(api_key=settings.groq_api_key,
    base_url="https://api.groq.com/openai/v1",)

ANALYSIS_PROMPT_TEMPLATE = """
You are an expert technical recruiter. Analyze the resume below{job_context}.

Return ONLY valid JSON, with no markdown formatting, no code fences, and no extra text.
Use exactly this shape:

{{
  "score": <integer 0-100, overall resume quality or match score>,
  "matched_skills": [<list of strings>],
  "missing_skills": [<list of strings>],
  "suggestions": [<list of strings, actionable improvement suggestions>]
}}

Resume text:
\"\"\"
{resume_text}
\"\"\"
{job_section}
"""


def build_prompt(resume_text: str, job_description_text: str | None) -> str:
    if job_description_text:
        job_context = " against the job description provided"
        job_section = f'\nJob description:\n"""\n{job_description_text}\n"""'
    else:
        job_context = ""
        job_section = ""

    return ANALYSIS_PROMPT_TEMPLATE.format(
        job_context=job_context,
        resume_text=resume_text,
        job_section=job_section,
    )


def call_ai_for_analysis(resume_text: str, job_description_text: str | None) -> dict:
    prompt = build_prompt(resume_text, job_description_text)

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    raw_content = response.choices[0].message.content

    try:
        parsed = json.loads(raw_content)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI response could not be parsed as JSON",
        )

    return {"parsed": parsed, "raw": raw_content}