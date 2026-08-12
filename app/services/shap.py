import shap
import pandas as pd

from app.core.model_loader import get_model

FEATURE_NAMES = {
    "Age": "Age",
    "Avg_Daily_Usage_Hours": "Daily Usage",
    "Daily_Unlocks": "Daily Unlocks",
    "Study_Hours": "Study Hours",
    "Physical_Activity_Hours": "Physical Activity",
    "Sleep_Hours_Per_Night": "Sleep Hours",
    "Stress_Level": "Stress Level",
    "Gender": "Gender",
    "Grouped_country": "Country",
    "Academic_Level": "Academic Level",
    "Most_Used_Platform": "Most Used Platform",
    "Purpose_Of_Use": "Purpose of Use"
}

def get_feature_value(input_df, feature):

    value = input_df.iloc[0][feature]

    if pd.isna(value):
        return None

    if hasattr(value, "item"):
        return value.item()

    return value


def explain_prediction(input_df: pd.DataFrame,pipeline):



    # Get preprocessing
    preprocessor = pipeline.named_steps["preprocessor"]

    # Get Random Forest
    model = pipeline.named_steps["random forest"]

    # Apply preprocessing
    transformed_data = preprocessor.transform(input_df)

    # Create SHAP explainer
    explainer = shap.TreeExplainer(model)

    # Calculate SHAP values
    shap_values = explainer.shap_values(transformed_data)

    # We have only one prediction
    shap_values = shap_values[0]

    # -----------------------------------------
    # Get feature names
    # -----------------------------------------

    feature_names = []

    for name, transformer, columns in preprocessor.transformers_:

        if name == "remainder":
            continue

        for column in columns:

            if name == "categorical":

                encoder = transformer.named_steps["one_hot_encoding"]

                column_index = list(columns).index(column)

                categories = encoder.categories_[column_index]

                for category in categories:
                    feature_names.append(
                        f"{column}_{category}"
                    )

            else:
                feature_names.append(column)

    # -----------------------------------------
    # Create raw SHAP results
    # -----------------------------------------

    raw_results = []

    for feature, impact in zip(feature_names, shap_values):

        raw_results.append(
            {
                "feature": feature,
                "impact": float(impact)
            }
        )

    # -----------------------------------------
    # Combine encoded features
    # -----------------------------------------

    original_features = [
        "Gender",
        "Grouped_country",
        "Academic_Level",
        "Most_Used_Platform",
        "Purpose_Of_Use"
    ]

    combined = {}

    for item in raw_results:

        feature = item["feature"]
        impact = item["impact"]

        original_name = feature

        for original_feature in original_features:

            if feature.startswith(original_feature + "_"):
                original_name = original_feature
                break

        if original_name not in combined:
            combined[original_name] = 0

        combined[original_name] += impact

    # -----------------------------------------
    # Convert to final format
    # -----------------------------------------

    explanations = []

    for feature, impact in combined.items():

        if impact > 0:
            direction = "increases"
        elif impact < 0:
            direction = "decreases"
        else:
            direction = "neutral"

        explanations.append(
            {
                "feature": FEATURE_NAMES.get(feature, feature),
                "value": get_feature_value(input_df, feature),
                "impact": round(impact, 4),
                "direction": direction
            }
        )

    # Strongest factors first
    explanations.sort(
        key=lambda x: abs(x["impact"]),
        reverse=True
    )

    
    return explanations