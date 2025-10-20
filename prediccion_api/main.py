from fastapi import FastAPI
from predictor import train_models, predict_duracion, predict_demanda
from schemas import (
    PrediccionDuracionRequest, PrediccionDuracionResponse,
    PrediccionDemandaRequest, PrediccionDemandaResponse
)

app = FastAPI(title="API de Predicciones de Reservas")

@app.on_event("startup")
def startup_event():
    train_models()

@app.post("/predict/duracion", response_model=PrediccionDuracionResponse)
def prediccion_duracion(request: PrediccionDuracionRequest):
    duracion = predict_duracion(request.persona_id, request.sala_id, request.articulo_id)
    return PrediccionDuracionResponse(duracion_estimado_horas=duracion)

@app.post("/predict/demanda", response_model=PrediccionDemandaResponse)
def prediccion_demanda(request: PrediccionDemandaRequest):
    demanda = predict_demanda(request.fecha, request.sala_id)
    return PrediccionDemandaResponse(demanda_esperada=demanda)
