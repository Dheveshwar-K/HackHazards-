from fastapi import APIRouter
import random
from datetime import datetime, timedelta

router = APIRouter()

ALERTS_DATABASE = [
    {
        "id": "alert-001",
        "title": "IUU Fishing Activity Detected",
        "category": "Illegal Fishing",
        "priority": "Critical",
        "timestamp": "",
        "latitude": -12.45,
        "longitude": 113.88,
        "ai_explanation": "Vessel crossing boundaries into Marine Protected Area (MPA) Zone-3. Transponder disabled 2 hours ago. Speed telemetry (2.1 knots) matches active longline fishing patterns.",
        "suggested_action": "Dispatched autonomous patrol drone UAV-OceanSentry. Transmitting coordinates to local fisheries authority."
    },
    {
        "id": "alert-002",
        "title": "Coral Acidification Critical Event",
        "category": "Coral Bleaching",
        "priority": "High",
        "timestamp": "",
        "latitude": -8.32,
        "longitude": 142.15,
        "ai_explanation": "Dissolved pH dropped to 7.82. Regional marine heatwave (SST anomaly +2.4C) sustained for 14 days, raising bleaching threshold risk to severe.",
        "suggested_action": "Alert local research institute. Prepare emergency shading panels if thermal stress continues."
    },
    {
        "id": "alert-003",
        "title": "Suspected Heavy Metal Pollution Plume",
        "category": "Pollution",
        "priority": "High",
        "timestamp": "",
        "latitude": 4.12,
        "longitude": 101.45,
        "ai_explanation": "Spectral analysis from Sentinel-2 satellite indicates anomaly matching agricultural runoff/chemical waste. Turbidity increased by 180%.",
        "suggested_action": "Deploy aquatic sensor buoy B-14 to measure organic pollutants and heavy metal toxicity levels."
    },
    {
        "id": "alert-004",
        "title": "Marine Heatwave Alert",
        "category": "Climate Event",
        "priority": "Medium",
        "timestamp": "",
        "latitude": 28.50,
        "longitude": -82.40,
        "ai_explanation": "SST anomaly +1.8C detected across Gulf Loop Current. Expected to persist for 8 days. Dissolved oxygen drop expected.",
        "suggested_action": "Notify local aquacultures to adjust aeration rates and monitor hypoxia indicators."
    }
]

@router.get("/alerts")
def get_alerts():
    # Update timestamp dynamically relative to current time
    base_time = datetime.utcnow()
    for idx, alert in enumerate(ALERTS_DATABASE):
        # Subtract some minutes/hours to simulate real events
        time_diff = timedelta(minutes=15 * (idx + 1) + idx * 45)
        alert["timestamp"] = (base_time - time_diff).strftime("%Y-%m-%dT%H:%M:%SZ")
        
    return ALERTS_DATABASE
