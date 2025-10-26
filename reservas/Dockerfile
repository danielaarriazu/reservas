# Etapa 1: Build con Maven
FROM maven:3.9.2-eclipse-temurin-17 AS build

WORKDIR /app

# Copiar pom.xml y src
COPY pom.xml .
COPY src ./src

# Construir el JAR (Spring Boot)
RUN mvn clean package -DskipTests

# Etapa 2: Runtime
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copiar el JAR generado
COPY --from=build /app/target/*.jar app.jar

# Copiar la carpeta de datos
COPY data /app/data

# Exponer puerto 8080
EXPOSE 8080

# Ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
