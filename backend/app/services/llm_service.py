from __future__ import annotations

import json
import os
from typing import Any, Dict

import httpx


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


async def analyze_with_gemini(raw_text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """
    Call the Gemini API to analyze a legal case document.

    Returns a dict with:
      - summary (string)
      - risk_clauses (list[{text, severity}])
      - key_points (list[str])
      - strong_areas (list[{title, description}])
    """
    # If no API key configured, return a deterministic mock based on the text.
    if not GEMINI_API_KEY:
        lower_text = raw_text.lower()
        
        # Dynamic Risk extraction
        risk_clauses = []
        if "delay" in lower_text or "late" in lower_text or "deadline" in lower_text:
            risk_clauses.append({"text": "Schedule timeline dispute found in text. Strict adherence to deadlines may be challenged.", "severity": "high"})
        if "pay" in lower_text or "fee" in lower_text or "$" in lower_text:
            risk_clauses.append({"text": "Financial obligations and payment terms present. Ensure quantifiable damages are accurate.", "severity": "medium"})
        if "force majeure" in lower_text or "weather" in lower_text:
            risk_clauses.append({"text": "Force Majeure or act of god defenses detected. Jurisdiction-specific standards apply.", "severity": "high"})
        if not risk_clauses:
            risk_clauses.append({"text": "Standard contractual obligations and liabilities.", "severity": "low"})

        # Dynamic Strengths
        strong_areas = []
        if "breach" in lower_text:
            strong_areas.append({"title": "Identified Breach", "description": "The document explicitly references a breach of terms, providing a direct cause of action."})
        if "signed" in lower_text or "agreement" in lower_text:
            strong_areas.append({"title": "Formal Agreement", "description": "Evidence of a formalized agreement strengthens the enforceability of the claims."})
        if not strong_areas:
            strong_areas.append({"title": "Factual Basis", "description": "The document provides a factual narrative that can form the basis of a legal argument."})

        # Dynamic Summary & Key Points
        sentences = [s.strip() + "." for s in raw_text.split(".") if len(s.strip()) > 10]
        dynamic_summary = " ".join(sentences[:2]) if len(sentences) >= 2 else raw_text[:300] + "..."
        if len(dynamic_summary) < 50:
             dynamic_summary = "Document provided is very short. Please provide a detailed case file for a comprehensive summary."
             
        key_points = [s for s in sentences[2:5]] if len(sentences) > 4 else ["Analysis pending full document review."]

        return {
            "summary": f"[Offline Analysis] {dynamic_summary}",
            "risk_clauses": risk_clauses,
            "key_points": key_points,
            "strong_areas": strong_areas
        }

    system_prompt = (
        "You are an AI legal assistant helping a lawyer quickly triage a case file.\n"
        "Given the full text of the case and basic metadata, you must respond ONLY with valid JSON "
        "in the following structure without markdown blocks:\n"
        "{\n"
        '  "summary": string,\n'
        '  "risk_clauses": [\n'
        '    {"text": string, "severity": "low" | "medium" | "high"}\n'
        "  ],\n"
        '  "key_points": [string],\n'
        '  "strong_areas": [\n'
        '    {"title": string, "description": string} // Legal strengths or merits found directly within the case facts\n'
        '  ]\n'
        "}\n"
        "This is not legal advice and must be framed as an estimate."
    )

    user_content = (
        "Case metadata:\n"
        f"- Title: {metadata.get('title')}\n"
        f"- Jurisdiction: {metadata.get('jurisdiction')}\n"
        f"- Case type: {metadata.get('case_type')}\n\n"
        "=== SOURCE DOCUMENT ===\n"
        f"{raw_text}"
    )

    headers = {
        "Content-Type": "application/json",
    }
    
    payload = {
        "contents": [
            {
                "parts": [
                    {"text": system_prompt + "\n\n" + user_content}
                ]
            }
        ],
        "generationConfig": {
            "responseMimeType": "application/json",
            "temperature": 0.2
        }
    }

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"

    async with httpx.AsyncClient(timeout=60.0) as client:
        resp = await client.post(
            url,
            headers=headers,
            json=payload,
        )
        resp.raise_for_status()
        data = resp.json()

    try:
        content = data["candidates"][0]["content"]["parts"][0]["text"]
        parsed = json.loads(content)
    except httpx.HTTPError as e:
        print(f"HTTP Error calling Gemini API: {e}")
        raise Exception(f"Gemini API error: {e}")
    except Exception as e:
        print(f"Error parsing Gemini API response: {e}")
        raise Exception("Failed to parse Gemini API response")

async def analyze_signature_with_gemini(raw_text: str) -> dict:
    """
    Call Gemini API to analyze a document specifically for signature risks for a layperson.
    Returns a dict with:
      - is_risk_free (bool)
      - explanation (str)
      - risky_clauses (list[str])
    """
    if not GEMINI_API_KEY:
        lower_text = raw_text.lower()
        sentences = [s.strip() + "." for s in raw_text.split(".") if len(s.strip()) > 10]
        
        # Dynamic offline mock for signature risk
        risky_clauses = []
        for s in sentences:
            lower_s = s.lower()
            if "indemnify" in lower_s or "liability" in lower_s:
                risky_clauses.append(f"Liability/Indemnification Risk: The text states \"{s}\" - This forces you to assume financial responsibility for mistakes.")
            elif "waive" in lower_s or "forfeit" in lower_s or "non-compete" in lower_s:
                risky_clauses.append(f"Waiver of Rights: The text states \"{s}\" - You are actively giving up legal rights or future opportunities.")
            elif "penalty" in lower_s or "fee" in lower_s:
                risky_clauses.append(f"Hidden Penalty: The text states \"{s}\" - This exposes you to strict financial penalties.")
                
            if len(risky_clauses) >= 4:
                break
        
        is_risk_free = len(risky_clauses) == 0
        explanation = ("Based on a scan of the text, this document appears generally standard without major hidden red flags, though you should still read it carefully." 
                       if is_risk_free else 
                       f"Based on a direct scan of the text you uploaded, there are {len(risky_clauses)} critical terms that explicitly favor the other party. Review these exact extracted clauses below before signing:")

        return {
            "is_risk_free": is_risk_free,
            "explanation": f"[Offline Analysis] {explanation}",
            "risky_clauses": risky_clauses
        }

    system_prompt = (
        "You are an expert consumer protection lawyer advising a client who has absolutely no legal background.\n"
        "The client has provided a document they are being asked to sign.\n"
        "Your job is to read the document and definitively tell them if it is safe to sign or if there are hidden traps.\n"
        "Return ONLY a strictly valid JSON object with the following schema:\n"
        "{\n"
        "  \"is_risk_free\": boolean,\n"
        "  \"explanation\": \"A 2-3 sentence explanation in plain English summarizing why it's safe or dangerous to sign.\",\n"
        "  \"risky_clauses\": [\"Explanation of risk 1 in plain English\", \"Explanation of risk 2 in plain English\"]\n"
        "}\n"
        "If `is_risk_free` is true, the `risky_clauses` array should be empty. Do not include markdown formatting or backticks around the JSON."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": system_prompt}]},
            {"role": "user", "parts": [{"text": f"DOCUMENT TEXT:\n{raw_text}"}]}
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=60.0)
            response.raise_for_status()

            data = response.json()
            response_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            
            # Remove any markdown wrapping from the response
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            parsed_data = json.loads(response_text)
            return parsed_data
            
    except Exception as e:
        print(f"Error during signature analysis processing: {e}")
        # Graceful fallback on error
        return {
             "is_risk_free": False,
             "explanation": "We encountered an error analyzing the signature risks of this document. Please review it carefully with a professional.",
             "risky_clauses": []
        }

async def chat_with_gemini(message: str) -> dict:
    """
    Call Gemini API to act as a conversational legal assistant named LawGenie.
    Returns a dict with:
      - explanation (str)
      - statutes (list[str])
      - nextSteps (list[str])
    """
    if not GEMINI_API_KEY:
        lower_msg = message.lower()
        
        # Dynamic offline mock for chatbot
        if "evict" in lower_msg or "landlord" in lower_msg or "rent" in lower_msg:
            return {
                "explanation": "Based on your query regarding housing or eviction, tenants generally have protected rights against unlawful or sudden eviction without proper legal notice.",
                "statutes": ["Rent Control Act (Local jurisdiction)", "Transfer of Property Act, 1882"],
                "nextSteps": ["Review your rental agreement for notice periods", "Document all communication with your landlord", "Do not vacate without a formal eviction order from a court"]
            }
        elif "terminate" in lower_msg or "fire" in lower_msg or "job" in lower_msg:
            return {
                "explanation": "Wrongful termination cases depend heavily on your employment contract and local labor laws. Employers generally cannot fire you for discriminatory reasons or in retaliation.",
                "statutes": ["Industrial Disputes Act, 1947", "State Shops and Establishments Act"],
                "nextSteps": ["Request the reason for termination in writing", "Review your employment contract and severance terms", "Consult a labor law attorney"]
            }
        elif "scam" in lower_msg or "fake" in lower_msg or "fraud" in lower_msg:
            return {
                "explanation": "This situation appears to involve fraud or cybercrime. Taking immediate action to secure your identity and report the incident is crucial.",
                "statutes": ["Information Technology Act, 2000", "Indian Penal Code (Sections on Cheating and Forgery)"],
                "nextSteps": ["Preserve all digital evidence and communication", "Report the incident to the National Cyber Crime portal", "File an FIR at your local police station"]
            }
        else:
             return {
                "explanation": "LawGenie has received your query. To provide the best legal brief, I need to analyze the specifics of your situation against relevant statutes.",
                "statutes": ["Indian Contract Act, 1872", "Specific Relief Act, 1963"],
                "nextSteps": ["Gather any documents related to this issue", "Write down a timeline of events", "Consider speaking with a qualified advocate for tailored advice"]
            }

    system_prompt = (
        "You are LawGenie, a highly intelligent and empathetic legal assistant.\n"
        "A user is asking you for legal advice or explaining a situation.\n"
        "Your goal is to provide a structured, easy-to-understand 'Legal Brief'.\n"
        "Return ONLY a strictly valid JSON object with the following schema:\n"
        "{\n"
        "  \"explanation\": \"A 3-5 sentence compassionate and clear explanation of the legal principles involved in their situation.\",\n"
        "  \"statutes\": [\"Name of Relevant Law/Act 1\", \"Name of Relevant Law/Act 2\"],\n"
        "  \"nextSteps\": [\"Actionable step 1\", \"Actionable step 2\", \"Actionable step 3\"]\n"
        "}\n"
        "Do not include markdown formatting or backticks around the JSON."
    )

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": system_prompt}]},
            {"role": "user", "parts": [{"text": f"USER QUERY:\n{message}"}]}
        ]
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=60.0)
            response.raise_for_status()

            data = response.json()
            response_text = data["candidates"][0]["content"]["parts"][0]["text"].strip()
            
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            if response_text.endswith("```"):
                response_text = response_text[:-3]

            parsed_data = json.loads(response_text)
            return parsed_data
            
    except Exception as e:
        print(f"Error during chatbot processing: {e}")
        return {
             "explanation": "I'm currently experiencing high volume and couldn't process your request. Please try again shortly.",
             "statutes": [],
             "nextSteps": ["Please try your query again later", "If urgent, contact a human legal specialist"]
        }

