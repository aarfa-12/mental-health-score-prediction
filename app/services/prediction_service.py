import pandas as pd
from app.core.config import TOP_COUNTRIES
from app.core.model_loader import get_model
from app.schemas.prediction_schemas import PersonData
from app.utils.helper import group_country
from app.services.shap import explain_prediction
from app.services.recommendation_service import generate_recommendations

def predict_score(data : PersonData):
    
    country_group = group_country(data.country)
        
    input_df = pd.DataFrame([{
            'Age'                       : data.age , 
            'Gender'                    : data.gender , 
            'Country'                   : data.country, 
            'Academic_Level'            : data.academic_level, 
            'Most_Used_Platform'        : data.most_used_platform,
            'Purpose_Of_Use'            : data.purpose_of_use, 
            'Avg_Daily_Usage_Hours'     : data.avg_daily_usage_hours, 
            'Daily_Unlocks'             : data.daily_unlocks,
            'Study_Hours'               : data.study_hours , 
            'Physical_Activity_Hours'   : data.physical_activity_hours, 
            'Sleep_Hours_Per_Night'     : data.sleep_hours_per_night,
            'Stress_Level'              : data.stress_level, 
            'Grouped_country'           : country_group
            
        }])
    
    


        
    model = get_model()
    prediction = model.predict(input_df)[0]
    
    explanation = explain_prediction(input_df,model)

    recommendations = generate_recommendations(data, explanation)
    
    
    return {
        'predicted_mental_health_score' : round(float(prediction),2),
        'shap_explanation' : explanation,
        'recommendations' : recommendations
    }