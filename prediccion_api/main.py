from fastapi import FastAPI
import pandas as pd  # 🔹 <- Faltaba este import
from database import cargar_reservas
from predictor import predecir_demanda_salas, predecir_mantenimiento_articulos

app = FastAPI(title="API de Predicción de Reservas", version="1.0")

# -----------------------------
# 📈 Predicción de demanda por Sala
# -----------------------------
@app.get("/prediccion/salas")
def prediccion_salas():
    df = cargar_reservas()
    resultado = predecir_demanda_salas(df)
    return resultado.to_dict(orient="records") if isinstance(resultado, pd.DataFrame) else resultado


# -----------------------------
# ⚙️ Predicción de mantenimiento/reposición de Artículos
# -----------------------------
@app.get("/prediccion/articulos")
def prediccion_articulos():
    df = cargar_reservas()
    resultado = predecir_mantenimiento_articulos(df)
    return resultado.to_dict(orient="records") if isinstance(resultado, pd.DataFrame) else resultado

