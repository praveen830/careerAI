package com.careerai.ai.assistant.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "app.ai")
public class GeminiConfig {

    /**
     * Gemini / External AI API Key.
     * Mapped securely from app.ai.api-key (or AI_API_KEY environment variable).
     * Never hardcoded into source code.
     */
    private String apiKey;

    /**
     * AI Provider name (e.g. "gemini", "openai", "none").
     */
    private String provider = "gemini";

    /**
     * Model identifier (e.g. "gemini-3.6-flash").
     */
    private String model = "gemini-3.6-flash";
}
