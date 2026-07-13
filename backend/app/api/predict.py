from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.ML.ml_model import ocean_ml_model
import random

router = APIRouter()

class PredictionInput(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Latitude coordinate")
    longitude: float = Field(..., ge=-180, le=180, description="Longitude coordinate")
    month: int = Field(..., ge=1, le=12, description="Month of prediction (1-12)")
    temperature: float = Field(..., ge=-5, le=45, description="Water temperature in Celsius")
    salinity: float = Field(..., ge=10, le=50, description="Salinity in PSU")
    chlorophyll: float = Field(..., ge=0.01, le=20.0, description="Chlorophyll concentration in mg/m3")
    current_speed: float = Field(..., ge=0.0, le=5.0, description="Current speed in m/s")
    model: str = Field("Random Forest", description="Model selected (Random Forest, XGBoost)")

class OceanHealthInput(BaseModel):
    dissolved_oxygen: float
    ph: float
    salinity: float
    temperature: float
    chlorophyll: float
    pollution_index: float

@router.post("/fish-density")
def predict_fish_density(payload: PredictionInput):
    try:
        results = ocean_ml_model.predict(
            lat=payload.latitude,
            lon=payload.longitude,
            month=payload.month,
            temp=payload.temperature,
            salinity=payload.salinity,
            chloro=payload.chlorophyll,
            current_speed=payload.current_speed
        )
        # Add some extra randomized but semi-deterministic metadata for dashboard HUD elements
        random.seed(int(payload.latitude + payload.longitude + payload.month))
        
        weather_states = ["Safe", "Moderate Warning", "Unsafe - Storm Alert"]
        wave_heights = ["Low (0.5m)", "Moderate (1.5m)", "High (3.0m)"]
        
        results.update({
            "weather": random.choice(weather_states),
            "wave_height": random.choice(wave_heights),
            "coral_bleaching_risk": f"{random.randint(5, 45)}%",
            "threat_level": "Low" if results["suitability"] == "High" else ("Medium" if results["suitability"] == "Medium" else "High"),
            "ocean_health_score": round(80 + random.uniform(-15, 18), 1)
        })
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ocean-health")
def calculate_ocean_health(payload: OceanHealthInput):
    # Dynamic calculations of ocean health index
    # Plausible biological formula for mock scoring
    do_score = max(0, min(100, (payload.dissolved_oxygen / 8.0) * 100))
    ph_score = max(0, min(100, (1.0 - abs(payload.ph - 8.1) / 1.5) * 100)) # ideal pH is around 8.1
    pollution_score = 100 - payload.pollution_index
    
    overall_score = (do_score * 0.3) + (ph_score * 0.3) + (pollution_score * 0.4)
    overall_score = max(0, min(100, overall_score))
    
    # Recommendations based on components
    recommendations = []
    if payload.pollution_index > 40:
        recommendations.append("Deploy marine clean-up drones in current vector directions.")
    if payload.dissolved_oxygen < 5.0:
        recommendations.append("Hypoxia risk. Check for local nutrient runoff causing algal blooms.")
    if abs(payload.ph - 8.1) > 0.4:
        recommendations.append("Ocean acidification threshold breached. Monitor local carbonate levels.")
        
    if not recommendations:
        recommendations.append("Ecosystem indicators stable. Continue routine autonomous patrols.")

    return {
        "overall_health_score": round(overall_score, 1),
        "dissolved_oxygen_status": "Optimal" if payload.dissolved_oxygen >= 6.5 else ("Stressed" if payload.dissolved_oxygen >= 4.0 else "Critical"),
        "ph_status": "Balanced" if 7.9 <= payload.ph <= 8.3 else "Imbalanced",
        "acidification_risk": "Low" if payload.ph >= 7.9 else "High",
        "recommendations": recommendations,
        "historical_trends": [round(overall_score + random.uniform(-5, 5), 1) for _ in range(6)]
    }
