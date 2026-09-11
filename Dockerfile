# Stage 1: Build Spring Boot JAR with Maven & OpenJDK 17
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app

# Check if pom.xml is in root or backend/ and copy accordingly
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal OpenJDK 17 Runtime image
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/careerai-backend-0.0.1-SNAPSHOT.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
