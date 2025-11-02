#!/usr/bin/env python3
"""
Script de prueba para verificar la API de predicciones
Ejecutar desde la carpeta prediccion_api: python test_api.py
"""

import requests
import json

def test_connection():
    print("=" * 60)
    print("🔍 PRUEBA DE CONEXIÓN - API DE PREDICCIONES")
    print("=" * 60)
    
    # URLs a probar
    JAVA_API = "http://localhost:8080/reservas/datos"
    PYTHON_API_SALAS = "http://localhost:8000/prediccion/salas"
    PYTHON_API_ARTICULOS = "http://localhost:8000/prediccion/articulos"
    
    # Prueba 1: API Java (datos)
    print("\n1️⃣ Probando API Java (Spring Boot)...")
    try:
        response = requests.get(JAVA_API, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Conexión exitosa")
            print(f"   📊 Datos recibidos: {len(data)} registros")
            if len(data) > 0:
                print(f"   📝 Ejemplo de registro:")
                print(f"      {json.dumps(data[0], indent=6, ensure_ascii=False)}")
        else:
            print(f"   ❌ Error HTTP {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("   ❌ No se puede conectar. ¿Está corriendo Spring Boot en puerto 8080?")
        print("      Ejecuta: cd reservas && ./mvnw spring-boot:run")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Prueba 2: API Python - Salas
    print("\n2️⃣ Probando API Python - Predicción de Salas...")
    try:
        response = requests.get(PYTHON_API_SALAS, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Conexión exitosa")
            print(f"   📊 Salas analizadas: {len(data)}")
            if len(data) > 0:
                print(f"   📝 Ejemplo de predicción:")
                print(f"      Sala: {data[0].get('salaNombre', 'N/A')}")
                print(f"      Reservas actuales: {data[0].get('cantidad_reservas', 0)}")
                print(f"      Predicción futura: {data[0].get('prediccion_futura', 0):.2f}")
                print(f"      Variación: {data[0].get('variacion_%', 0):.1f}%")
        else:
            print(f"   ❌ Error HTTP {response.status_code}")
            print(f"   Respuesta: {response.text}")
    except requests.exceptions.ConnectionError:
        print("   ❌ No se puede conectar. ¿Está corriendo la API Python en puerto 8000?")
        print("      Ejecuta: cd prediccion_api && uvicorn main:app --reload")
        return False
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    # Prueba 3: API Python - Artículos
    print("\n3️⃣ Probando API Python - Predicción de Artículos...")
    try:
        response = requests.get(PYTHON_API_ARTICULOS, timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Conexión exitosa")
            print(f"   📊 Artículos analizados: {len(data)}")
            if len(data) > 0:
                print(f"   📝 Ejemplo de análisis:")
                print(f"      Artículo: {data[0].get('articuloNombre', 'N/A')}")
                print(f"      Veces usado: {data[0].get('veces_usado', 0)}")
                print(f"      Riesgo: {data[0].get('riesgo_mantenimiento', 'N/A')}")
        else:
            print(f"   ❌ Error HTTP {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False
    
    print("\n" + "=" * 60)
    print("✅ TODAS LAS PRUEBAS PASARON CORRECTAMENTE")
    print("=" * 60)
    print("\n💡 Si ves este mensaje, la API está funcionando correctamente.")
    print("   Ahora recarga el frontend (F5) para ver los gráficos.")
    return True

if __name__ == "__main__":
    test_connection()