import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib
from database import cargar_reservas
from models import build_duracion_model, build_demanda_model

def train_models():
    df = cargar_reservas()

    # ---- Modelo de duración ----
    X_duracion = df[["persona_id", "sala_id", "articulo_id"]]
    y_duracion = df["duracion_horas"]
    duracion_model = build_duracion_model()
    duracion_model.fit(X_duracion, y_duracion)
    joblib.dump(duracion_model, "models/duracion_model.pkl")

    # ---- Modelo de demanda ----
    demanda_df = df.groupby(["fecha", "sala_id"]).size().reset_index(name="cantidad_reservas")
    X_demanda = demanda_df[["fecha", "sala_id"]]
    X_demanda["fecha"] = pd.to_datetime(X_demanda["fecha"]).map(pd.Timestamp.toordinal)
    y_demanda = demanda_df["cantidad_reservas"]

    demanda_model = build_demanda_model()
    demanda_model.fit(X_demanda, y_demanda)
    joblib.dump(demanda_model, "models/demanda_model.pkl")

    print("✅ Modelos entrenados y guardados correctamente.")

def predict_duracion(persona_id, sala_id, articulo_id):
    model = joblib.load("models/duracion_model.pkl")
    X_new = pd.DataFrame([[persona_id, sala_id, articulo_id]], columns=["persona_id", "sala_id", "articulo_id"])
    return float(model.predict(X_new)[0])

def predict_demanda(fecha, sala_id):
    model = joblib.load("models/demanda_model.pkl")
    X_new = pd.DataFrame([[pd.Timestamp(fecha).toordinal(), sala_id]], columns=["fecha", "sala_id"])
    return float(model.predict(X_new)[0])
