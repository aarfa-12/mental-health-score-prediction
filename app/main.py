from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.model_loader import get_model
from app.core.config import TOP_COUNTRIES
from app.schemas.prediction_schemas import PersonData,PredictionResponse
from app.services.prediction_service import predict_score
from app.api.routes import router
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi import Request

app = FastAPI()

app.mount(
    "/assets",
    StaticFiles(directory="frontend/assets"),
    name="assets"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
     )

app.include_router(router)

templates = Jinja2Templates(directory="frontend") 

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )

@app.get("/predict-page")
def predict_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="predict.html"
    )


@app.get("/about-page")
def predict_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="about.html"
    )


@app.get("/contact-page")
def predict_page(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="contact.html"
    )


    
    