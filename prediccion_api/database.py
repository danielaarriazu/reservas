# database.py
import pandas as pd
import requests

def cargar_reservas(url="http://localhost:8080/reservas/datos", timeout=10):
    """
    Descarga los datos desde el endpoint Java y los devuelve como DataFrame.
    Asegúrate que el backend de Spring Boot esté corriendo antes de ejecutar.
    """
    try:
        response = requests.get(url, timeout=timeout)
        response.raise_for_status()
        data = response.json()

        df = pd.DataFrame.from_records(data)

        # columnas esperadas por predictor.py
        expected = [ "salaId", "salaNombre", "salaCapacidad", "articuloId", "articuloNombre", "fecha", "duracion_horas"]
        for col in expected:
            if col not in df.columns:
                df[col] = None

        # convertir tipos
        df["salaId"] = pd.to_numeric(df["salaId"], errors="coerce").astype("Int64")
        df["salaCapacidad"] = pd.to_numeric(df["salaCapacidad"], errors="coerce").astype("Int64")
        df["articuloId"] = pd.to_numeric(df["articuloId"], errors="coerce").astype("Int64")
        df["duracion_horas"] = pd.to_numeric(df["duracion_horas"], errors="coerce").fillna(0.0)
        df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce").dt.date.astype("object")
        
         # Limpiar strings
        for col in ["salaNombre", "articuloNombre"]:
            df[col] = df[col].astype(str).replace("None", "")

        print(f"✅ Datos cargados correctamente ({len(df)} registros)")
        return df

    except requests.RequestException as e:
        print(f"⚠️ Error al obtener datos desde {url}: {e}")
        return pd.DataFrame(columns=["salaId", "salaNombre", "salaCapacidad",
            "articuloId", "articuloNombre",
            "fecha", "duracion_horas"])