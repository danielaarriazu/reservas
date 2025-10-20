# database.py
import pandas as pd
from pathlib import Path

CSV_PATH = Path("../reservas/data/reservas.csv")

def cargar_reservas():
    """Carga las reservas desde el archivo CSV."""
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"No se encontró el archivo {CSV_PATH.resolve()}")
    
    df = pd.read_csv(CSV_PATH)
    # Convertimos fechas
    df['fecha_hora_inicio'] = pd.to_datetime(df['fecha_hora_inicio'])
    df['fecha_hora_fin'] = pd.to_datetime(df['fecha_hora_fin'])
    df["duracion_horas"] = (df["fecha_hora_fin"] - df["fecha_hora_inicio"]).dt.total_seconds() / 3600.0
    df["fecha"] = df["fecha_hora_inicio"].dt.date
    return df
