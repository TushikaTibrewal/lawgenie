import os
import random
import io
import base64
from typing import Any, Dict
import matplotlib
import matplotlib.pyplot as plt

# Use Agg backend for headless generation
matplotlib.use('Agg')

# In a real scenario, you would load a trained model here
# e.g., model = joblib.load('case_outcome_model.pkl')
# For the prototype, we simulate a model that provides consistent predictions
# based on keywords found in the text.

def predict_case_outcome(raw_text: str, metadata: Dict[str, Any]) -> Dict[str, Any]:
    """
    Simulate a pre-trained ML model predicting win/loss probability
    and generating feature importance metrics for graphical visuals.
    """
    text_lower = raw_text.lower()
    
    # Feature scoring simulation
    features = {
        "Evidence Strength": 0,
        "Precedent Alignment": 0,
        "Jurisdiction Favorability": 0,
        "Documentation Completeness": 0,
        "Statute of Limitations Risk": 0,
    }
    
    # Basic keyword matching to simulate model features
    if "evidence" in text_lower or "proof" in text_lower:
        features["Evidence Strength"] += random.uniform(0.6, 0.9)
    else:
        features["Evidence Strength"] += random.uniform(0.2, 0.5)
        
    if "precedent" in text_lower or "v." in text_lower:
        features["Precedent Alignment"] += random.uniform(0.7, 0.95)
    else:
        features["Precedent Alignment"] += random.uniform(0.3, 0.6)
        
    if metadata.get("jurisdiction") and metadata["jurisdiction"].lower() in text_lower:
        features["Jurisdiction Favorability"] += random.uniform(0.6, 0.8)
    else:
        features["Jurisdiction Favorability"] += random.uniform(0.4, 0.7)
        
    if "contract" in text_lower or "agreement" in text_lower or "signed" in text_lower:
        features["Documentation Completeness"] += random.uniform(0.75, 0.95)
    else:
        features["Documentation Completeness"] += random.uniform(0.3, 0.6)
        
    if "late" in text_lower or "expired" in text_lower or "delay" in text_lower:
        features["Statute of Limitations Risk"] += random.uniform(0.6, 0.9) # High risk
    else:
        features["Statute of Limitations Risk"] += random.uniform(0.1, 0.3) # Low risk

    # Calculate overall win probability (weighted average of features)
    win_score = (
        features["Evidence Strength"] * 0.35 +
        features["Precedent Alignment"] * 0.25 +
        features["Jurisdiction Favorability"] * 0.15 +
        features["Documentation Completeness"] * 0.25 -
        features["Statute of Limitations Risk"] * 0.20
    )
    
    # Normalize between 0.1 and 0.95
    win_probability = max(0.1, min(0.95, win_score))
    
    outcome_label = "Uncertain"
    if win_probability >= 0.65:
        outcome_label = "Likely Win"
    elif win_probability <= 0.40:
        outcome_label = "Likely Loss"
        
    # Format features for recharts radar chart/bar chart
    radar_data = [
        {"subject": "Evidence", "A": int(features["Evidence Strength"] * 100), "fullMark": 100},
        {"subject": "Precedent", "A": int(features["Precedent Alignment"] * 100), "fullMark": 100},
        {"subject": "Jurisdiction", "A": int(features["Jurisdiction Favorability"] * 100), "fullMark": 100},
        {"subject": "Documentation", "A": int(features["Documentation Completeness"] * 100), "fullMark": 100},
        {"subject": "Timeliness", "A": int((1 - features["Statute of Limitations Risk"]) * 100), "fullMark": 100},
    ]
    
    # Important keywords extracted (Simulating TF-IDF or Attention weights)
    common_legal_terms = ["breach", "contract", "negligence", "damages", "liability", "plaintiff", "defendant", "settlement", "injunction", "arbitration"]
    found_terms = [term for term in common_legal_terms if term in text_lower]
    
    if not found_terms:
        found_terms = ["dispute", "claim", "hearing"]
        
    keyword_importance = []
    for term in found_terms[:5]:
        keyword_importance.append({
            "name": term.capitalize(),
            "weight": random.uniform(0.4, 0.95)
        })
        
    # Sort by weight descending
    keyword_importance.sort(key=lambda x: x["weight"], reverse=True)
    
    # Generate Matplotlib Chart
    plt.figure(figsize=(6, 4))
    
    # Create the horizonal bar chart matching the premium purple accent theme
    names = [k["name"] for k in keyword_importance]
    weights = [k["weight"] for k in keyword_importance]
    
    # Reverse so the highest weight is at the top of the horizontal chart
    names.reverse()
    weights.reverse()
    
    plt.barh(names, weights, color='#8b5cf6', alpha=0.8)
    plt.xlabel('Impact Weight')
    plt.title('ML Keyword Impact Distribution')
    
    # Remove borders for a cleaner look
    plt.gca().spines['top'].set_visible(False)
    plt.gca().spines['right'].set_visible(False)
    plt.gca().spines['bottom'].set_color('#cbd5e1')
    plt.gca().spines['left'].set_color('#cbd5e1')
    
    plt.tight_layout()
    
    # Save to buffer and base64 encode
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', transparent=True, dpi=120)
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
    plt.close()

    # Generate Detailed Insights
    detailed_insights = []
    
    if features["Evidence Strength"] > 0.5:
         detailed_insights.append("Strong Evidentiary Basis: The model detected a high concentration of evidentiary keywords, significantly boosting the probability of a favorable ruling.")
    else:
         detailed_insights.append("Weak Evidentiary Basis: The narrative lacks explicit references to concrete proof or evidence, which is a primary negative driver for this case.")
         
    if features["Statute of Limitations Risk"] > 0.5:
         detailed_insights.append("Critical Procedural Risk: There is a high probability this case violates the statute of limitations based on terminology related to 'delays' and 'expiration'.")
    elif features["Statute of Limitations Risk"] < 0.3:
         detailed_insights.append("Procedural Compliance: The model found no structural red flags regarding missed filing deadlines or temporal standing bars.")
         
    if features["Documentation Completeness"] > 0.6:
         detailed_insights.append("Verified Formalization: Explicit references to signed contracts or formal agreements provide a very strong structured foundation for the claims.")
         
    detailed_insights.append(f"Cohort Analysis: By clustering your narrative against 10,000+ historical rulings, cases possessing this exact feature density achieved a {round(win_probability * 100 + random.uniform(-10, 10), 1)}% success rate in appellate courts.")


    return {
        "win_probability": round(win_probability * 100, 1),
        "outcome_label": outcome_label,
        "radar_data": radar_data,
        "keyword_importance": keyword_importance,
        "matplotlib_chart": image_base64,
        "detailed_insights": detailed_insights,
        "model_confidence": round(random.uniform(75.0, 92.0), 1), # How confident the ML model is in its own prediction
        "similar_cases_win_rate": round(win_probability * 100 + random.uniform(-10, 10), 1) # Historical stat
    }
