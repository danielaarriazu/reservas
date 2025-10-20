from pydantic import BaseModel
from datetime import date

class PrediccionDuracionRequest(BaseModel):
    persona_id: int
    sala_id: int
    articulo_id: int

class PrediccionDuracionResponse(BaseModel):
    duracion_estimado_horas: float

class PrediccionDemandaRequest(BaseModel):
    fecha: date
    sala_id: int

class PrediccionDemandaResponse(BaseModel):
    demanda_esperada: float
