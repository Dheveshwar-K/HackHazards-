import os
import sys
# Resolve absolute paths to enable importing app package relative to backend root
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.api.predict import router as predict_router
from app.api.biodiversity import router as biodiversity_router
from app.api.alerts import router as alerts_router
import random

app = FastAPI(title="OceanMind AI Platform API", version="1.0.0")

# Setup CORS for Vite Dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify frontend port/domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(predict_router, prefix="/api/predictions", tags=["Predictions"])
app.include_router(biodiversity_router, prefix="/api/biodiversity", tags=["Biodiversity"])
app.include_router(alerts_router, prefix="/api/alerts", tags=["Alerts"])

class ChatMessage(BaseModel):
    message: str

AI_RESPONSES = [
    "Based on current satellite telemetry, Sea Surface Temperature (SST) in Zone 4 is elevated. We recommend reducing fishing quotas by 15% to allow pelagic species to seek thermocline refuge.",
    "eDNA sequencing alignment complete: Found significant traces of *Acropora cervicornis* (Staghorn Coral) in the northern reef shelf. Thermal stress index stands at 4.2 Degree Heating Weeks.",
    "Predictive modelling: Our Random Forest regressor forecasts a 22% increase in Bluefin Tuna density near coordinates (12.4S, 114.2E) due to chlorophyll concentration spikes.",
    "Ecosystem alert: Dissolved Oxygen values have dropped below 4.5 mg/L in coastal sectors. Suggest deploying oxygenation grid control systems to prevent benthic die-offs.",
    "Policy Advice: The United Nations BBNJ treaty requires a 30% reduction in deep-sea trawling within international waters. OceanMind AI telemetry is ready to export compliance audit PDFs."
]

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "OceanMind AI Command Core",
        "active_models": ["Random Forest Classifier", "Random Forest Regressor", "LSTM Ocean Forecast"],
        "database_mode": "SQLite (Sandbox Cache)"
    }

@app.post("/api/chat")
def chat_with_assistant(payload: ChatMessage):
    user_msg = payload.message.lower()
    
    # Simple keyword routing for high-fidelity responses
    if "fish" in user_msg or "predict" in user_msg or "catch" in user_msg:
        response = (
            "OceanMind AI predicts high fishery suitability in sectors with SST between 18°C and 22°C "
            "and chlorophyll concentrations above 2.5 mg/m³. I recommend launching a Fish Density "
            "Simulation on the dashboard to view optimal coordinates."
        )
    elif "coral" in user_msg or "bleach" in user_msg or "reef" in user_msg:
        response = (
            "Acropora species are showing moderate coral bleaching risks in Reef Sector B-14 due to "
            "the current marine heatwave. We recommend deploying local solar shading panels and "
            "reducing thermal stress metrics."
        )
    elif "dna" in user_msg or "edna" in user_msg or "species" in user_msg:
        response = (
            "Our latest eDNA sequence alignments have successfully mapped 42 distinct species, including "
            "vulnerable Bluefin Tuna and Critically Endangered Vaquitas. Review the Biodiversity Module "
            "for genetic alignment graphs."
        )
    elif "policy" in user_msg or "illegal" in user_msg or "fishing" in user_msg:
        response = (
            "We have flagged 4 high-priority threats, including 1 IUU (Illegal, Unreported, and Unregulated) "
            "fishing event. We suggest exporting the satellite tracking records to local coast guard "
            "agencies using the Analytics export toolbar."
        )
    elif "temp" in user_msg or "climate" in user_msg or "salinity" in user_msg:
        response = (
            "Salinity indexes are stable at 34.5 PSU, but SST is showing anomalies of +1.8°C across the Loop Current. "
            "This warming profile is likely to reduce dissolved oxygen concentrations. Let me know if you would like "
            "me to pull a 7-day forecast."
        )
    else:
        response = random.choice(AI_RESPONSES)
        
    return {
        "reply": response,
        "timestamp": "2026-07-09T22:51:00Z",
        "confidence": 0.97
    }
