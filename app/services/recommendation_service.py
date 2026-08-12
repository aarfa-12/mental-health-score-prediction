def generate_recommendations(data, shap_explanation):
    
    recommendations = []
    
    feature_mapping = {
    "Daily Usage": "Daily Usage",
    "Physical Activity": "Physical Activity",
    "Sleep Hours": "Sleep Hours",
    "Daily Unlocks": "Daily Unlocks",
    "Study Hours": "Study Hours",
    "Stress Level": "Stress Level",
    "Purpose of Use": "Purpose of Use"
        }
    
    # 1. Daily Screen usage
    if data.avg_daily_usage_hours >= 6 :
        recommendations.append({
            'title' : 'Reduced Daily Screen Usage',
            'message' : (f"Your daily screen usage is {data.avg_daily_usage_hours} hours. "
                "Try reducing your usage gradually by setting daily app limits."),
            'priority' : 'high',
            'related_feature' : 'Daily Usage'
        })
        
    elif data.avg_daily_usage_hours >= 4:
        recommendations.append({
            'title' : 'Monitor Daily Screen Usage',
            'message' : (f"Your daily screen usage is {data.avg_daily_usage_hours} hours. "
                "Consider taking regular breaks and setting reasonable usage limits."),
            'priority' : 'medium',
            'related_feature' : 'Daily Usage'
        })
        
    # 2. Physical activity
    if data.physical_activity_hours == 0:
        recommendations.append({
            'title' : 'Add Physical Activity',
            'message' : (
                "You reported no regular physical activity. "
                "Consider starting with a short daily walk or other enjoyable activity."),
            'priority' : 'high',
            'related_feature' : 'Physical Activity'
        })
        
    elif data.physical_activity_hours < 1:
        recommendations.append({
            'title' : 'Increase Physical Activity',
            'message' : (f"You currently report {data.physical_activity_hours} hours "
                "of physical activity. Consider gradually increasing your activity."),
            'priority' : 'medium',
            'related_feature' : 'Physical Activity'
        })
        
    # 3. Sleep
    
    if data.sleep_hours_per_night < 6:
        recommendations.append({
            'title' : 'Improve Sleep Routine',
            'message' : (f"You reported {data.sleep_hours_per_night} hours of sleep. "
                "Try maintaining a consistent sleep schedule and allowing enough "
                "time for rest."),
            'priority' : 'high',
            'related_feature' : 'Sleep Hours'
        })
        
        
    elif data.sleep_hours_per_night < 7:
        recommendations.append({
            'title': 'Maintain a Consistent Sleep Schedule',
            'message' : ("Your reported sleep duration could be improved. "
                "Try maintaining a consistent bedtime and wake-up time."),
            'priority' : 'medium',
            'related_feature' : 'Sleep Hours'
        })
        
    # 4. Daily Unlocks
    if data.daily_unlocks >= 80:
        recommendations.append({
            'title' : 'Reduce Frequent Phone Checking',
            'message' : (f"Your device is being unlocked around {data.daily_unlocks} times "
                "per day. Try grouping notifications and checking your phone "
                "at planned times."),
            'priority' : 'medium',
            'related_feature' : 'Daily Unlocks'
        })
        
    # 5. Study hours
    if data.study_hours < 2:
        recommendations.append({
            'title' : 'Create a Short Study Routine',
            'message' : (
                f"You currently report {data.study_hours} study hours. "
                "Try starting with short focused sessions and gradually "
                "building a consistent routine."
            ),
            'priority' : 'medium',
            'related_feature' : 'Study Hours'
        })
        
    # 6. Stress Level
    
    if data.stress_level == 'Very High':
        recommendations.append({
            'title' : 'Manage High Stress Levels',
            'message' : (
                "You reported a very high stress level. "
                "Consider taking regular breaks, using relaxation techniques, "
                "and maintaining a consistent daily routine."
            ),
            'priority' : 'high',
            'related_feature' : 'Stress Level'
        })
    elif data.stress_level == 'High':
        recommendations.append({
            'title' : 'Work on Stress Management',
            'message' : (
                "You reported a high stress level. "
                "Try incorporating short breaks, relaxation activities, "
                "and a consistent routine into your day."
            ),
            'priority' : 'medium',
            'related_feature' : 'Stress Level'
        })
        
    # 7. Purpose of Use
    if data.purpose_of_use == 'Entertainment':
        recommendations.append({
            'title' : 'Balance Entertainment Usage',
            'message': (
                "A significant part of your social media usage is for entertainment. "
                "Consider setting specific time limits for entertainment apps "
                "and balancing screen time with offline activities."
            ),
            'priority' : 'medium',
            'related_feature' : 'Purpose of Use'
        })
    
    # 8. Use SHAP to prioritize recommendations
    negative_features = {
        item["feature"]
        for item in shap_explanation
        if item["direction"] == "decreases"
    }
    
    # Mark recommendations as model-related
    for recommendation in recommendations:
        shap_feature = feature_mapping.get(recommendation["related_feature"],
                                           recommendation["related_feature"])
        
       
        recommendation["model_related"] = False
        recommendation["shap_impact"] = 0.0
        
        for item in shap_explanation:
            if (
                item["feature"] == shap_feature
                and item["direction"] == "decreases"
            ):
                recommendation["model_related"] =True
                recommendation["shap_impact"] = item["impact"]
                break
        
    
    recommendations.sort(key=lambda recommendation:(
        recommendation["model_related"],
        abs(recommendation["shap_impact"])
    ), reverse= True)    
    
    # Limit recommendations
    recommendations = recommendations[:5]
    
    return recommendations
    