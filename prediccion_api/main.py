from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from database import cargar_reservas
from predictor import predecir_demanda_salas, predecir_mantenimiento_articulos

app = FastAPI(title="API de Predicción de Reservas", version="1.0")

# ✅ CONFIGURAR CORS PARA PERMITIR REQUESTS DESDE FRONTEND
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# 🏠 Endpoint raíz (para verificar que está corriendo)
# -----------------------------
@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "API de Predicciones está corriendo correctamente",
        "endpoints": {
            "prediccion_salas": "/prediccion/salas",
            "prediccion_articulos": "/prediccion/articulos",
            "documentacion": "/docs"
        }
    }

# -----------------------------
# 📈 Predicción de demanda por Sala
# -----------------------------
@app.get("/prediccion/salas")
def prediccion_salas():
    try:
        print("🔍 Cargando datos de reservas...")
        df = cargar_reservas()
        
        if df.empty:
            print("⚠️ No hay datos de reservas")
            return {"error": "No hay datos de reservas disponibles"}
        
        print(f"✅ Datos cargados: {len(df)} registros")
        print(f"📊 Columnas disponibles: {list(df.columns)}")
        
        resultado = predecir_demanda_salas(df)
        
        if isinstance(resultado, pd.DataFrame):
            data = resultado.to_dict(orient="records")
            print(f"✅ Predicción generada para {len(data)} salas")
            return data
        else:
            return resultado
            
    except Exception as e:
        print(f"❌ Error en prediccion_salas: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}


# -----------------------------
# ⚙️ Predicción de mantenimiento/reposición de Artículos
# -----------------------------
@app.get("/prediccion/articulos")
def prediccion_articulos():
    try:
        print("🔍 Cargando datos de reservas para artículos...")
        df = cargar_reservas()
        
        if df.empty:
            print("⚠️ No hay datos de reservas")
            return {"error": "No hay datos de reservas disponibles"}
        
        print(f"✅ Datos cargados: {len(df)} registros")
        
        resultado = predecir_mantenimiento_articulos(df)
        
        if isinstance(resultado, pd.DataFrame):
            data = resultado.to_dict(orient="records")
            print(f"✅ Análisis generado para {len(data)} artículos")
            return data
        else:
            return resultado
            
    except Exception as e:
        print(f"❌ Error en prediccion_articulos: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"error": str(e)}


# -----------------------------
# 🔍 Endpoint de prueba para ver datos crudos
# -----------------------------
@app.get("/debug/datos")
def debug_datos():
    """Endpoint para ver los datos que está recibiendo la API"""
    try:
        df = cargar_reservas()
        return {
            "total_registros": len(df),
            "columnas": list(df.columns),
            "primeros_5_registros": df.head().to_dict(orient="records"),
            "info_columnas": {
                col: {
                    "tipo": str(df[col].dtype),
                    "valores_unicos": int(df[col].nunique()),
                    "valores_nulos": int(df[col].isnull().sum())
                } for col in df.columns
            }
        }
    except Exception as e:
        return {"error": str(e)}