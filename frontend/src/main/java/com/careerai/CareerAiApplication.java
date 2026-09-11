package com.careerai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@SpringBootApplication
public class CareerAiApplication {

    public static void main(String[] args) {
        loadDotEnv();
        SpringApplication.run(CareerAiApplication.class, args);
    }

    /**
     * Loads key-value pairs from .env into System properties so that Spring Boot
     * can resolve placeholders such as ${DB_PASSWORD}, ${DB_USERNAME}, etc.
     */
    private static void loadDotEnv() {
        Path[] searchPaths = new Path[] {
            Paths.get(".env"),
            Paths.get("backend", ".env"),
            Paths.get("..", ".env")
        };

        for (Path path : searchPaths) {
            if (Files.isRegularFile(path)) {
                try {
                    List<String> lines = Files.readAllLines(path);
                    for (String rawLine : lines) {
                        String line = rawLine.trim();
                        if (line.isEmpty() || line.startsWith("#") || !line.contains("=")) {
                            continue;
                        }
                        int separatorIndex = line.indexOf('=');
                        String key = line.substring(0, separatorIndex).trim();
                        String value = line.substring(separatorIndex + 1).trim();

                        if ((value.startsWith("\"") && value.endsWith("\"")) ||
                            (value.startsWith("'") && value.endsWith("'"))) {
                            value = value.substring(1, value.length() - 1);
                        }

                        if (System.getProperty(key) == null && System.getenv(key) == null) {
                            System.setProperty(key, value);
                        }
                    }
                    break;
                } catch (IOException ignored) {
                }
            }
        }
    }
}
