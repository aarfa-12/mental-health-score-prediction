import joblib

model = joblib.load('trained_model//Mental_Health_Model.pkl')

def get_model():
    return model
