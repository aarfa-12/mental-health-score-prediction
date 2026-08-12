from fastapi import APIRouter
from app.schemas.prediction_schemas import PersonData
from app.services.prediction_service import predict_score
from app.database.db import create_table, get_predictions, save_prediction, clear_predictions
from fastapi.responses import StreamingResponse
from app.services.report_service import generate_prediction_report



router = APIRouter()

# Create database table
create_table()

    
@router.post('/predict')   
def predict(data : PersonData):
    result = predict_score(data)
    
    score = result["predicted_mental_health_score"]

    if score >= 8:
        risk = "Healthy"
    elif score >= 6:
        risk = "Moderate"
    elif score >= 4:
        risk = "Needs Attention"
    else:
        risk = "Critical"

    save_prediction(
        score=score,
        risk=risk,
        status="Completed",
        shap_explanation=result["shap_explanation"],
        recommendations=result["recommendations"]
    )
    
    return result
        
    
@router.get("/prediction-history")
def prediction_history():

    return get_predictions()

@router.delete("/prediction-history")
def clear_prediction_history():

    clear_predictions()

    return {
        "message": "Prediction history cleared successfully."
    }

@router.get("/download-report")
def download_report():

    predictions = get_predictions()

    if not predictions:
        return {
            "error": "No prediction history available."
        }

    latest_prediction = predictions[0]

    pdf = generate_prediction_report(
        latest_prediction
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=mindsense_report.pdf"
        }
    )