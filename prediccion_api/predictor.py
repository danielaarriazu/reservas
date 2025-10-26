import pandas as pd
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# -----------------------------
# 1️⃣ Predicción de demanda por sala
# -----------------------------
def predecir_demanda_salas(df):
    if df.empty:
        return {"error": "No hay datos de reservas"}

    # Agrupar por sala
    resumen = df.groupby(["salaId", "salaNombre", "salaCapacidad"]).agg({
        "duracion_horas": "mean",
        "fecha": "count"
    }).rename(columns={
        "fecha": "cantidad_reservas",
        "duracion_horas": "duracion_promedio"
    }).reset_index()

    # Modelo lineal simulado (crecimiento simple)
    X = np.arange(len(resumen)).reshape(-1, 1)
    y = resumen["cantidad_reservas"].values
    model = LinearRegression().fit(X, y)
    prediccion = model.predict(X + 1)

    resumen["prediccion_futura"] = np.maximum(prediccion, 0).round(2)
    resumen["variacion_%"] = ((resumen["prediccion_futura"] - resumen["cantidad_reservas"]) /
                              resumen["cantidad_reservas"] * 100).round(1)

    return resumen.sort_values("prediccion_futura", ascending=False)


# -----------------------------
# 2️⃣ Predicción de mantenimiento/reposición por artículo
# -----------------------------
def predecir_mantenimiento_articulos(df):
    if df.empty:
        return {"error": "No hay datos de reservas"}

    resumen = df.groupby(["articuloId", "articuloNombre"]).agg({
        "duracion_horas": "mean",
        "fecha": "count"
    }).rename(columns={
        "fecha": "veces_usado",
        "duracion_horas": "duracion_promedio"
    }).reset_index()

    promedio_uso = resumen["veces_usado"].mean()
    resumen["riesgo_mantenimiento"] = np.where(
        resumen["veces_usado"] > promedio_uso, "ALTO", "NORMAL"
    )

    return resumen.sort_values("veces_usado", ascending=False)

