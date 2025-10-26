# Imagen base de Python ligera
FROM python:3.11-slim

# Evitar problemas de permisos y compatibilidad
ENV PYTHONUNBUFFERED=1

# Crear carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar solo los archivos de dependencias primero para aprovechar cache de Docker
COPY requirements.txt /app/

# Instalar dependencias
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el resto del proyecto
COPY . /app

# Copiar la carpeta de datos al lugar que espera la aplicación
COPY data /reservas/data

# Exponer el puerto 8000 para la API
EXPOSE 8000

# Ejecutar la API con uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
