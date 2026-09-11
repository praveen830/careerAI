package com.careerai.service.ai;

import com.careerai.ai.assistant.config.GeminiConfig;
import com.careerai.ai.assistant.dto.AIAssistantResponse;
import com.careerai.dto.aiassistant.ChatResponse;
import com.careerai.dto.aiassistant.StudentCareerContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.util.*;

@Slf4j
@Service
public class AiProviderService {

    private final CareerMentorEngine mentorEngine;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final GeminiConfig geminiConfig;

    public AiProviderService(CareerMentorEngine mentorEngine,
                             RestTemplateBuilder restTemplateBuilder,
                             ObjectMapper objectMapper,
                             GeminiConfig geminiConfig) {
        this.mentorEngine = mentorEngine;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofSeconds(10))
                .setReadTimeout(Duration.ofSeconds(60))
                .build();
        this.objectMapper = objectMapper;
        this.geminiConfig = geminiConfig;
    }

    public AIAssistantResponse generateResponse(String systemPrompt, String userMessage, StudentCareerContext context) {
        String apiKey = geminiConfig.getApiKey();
        String provider = geminiConfig.getProvider();
        String model = geminiConfig.getModel();

        // If API key is not configured or set to dummy/mock, use CareerMentorEngine directly
        if (!StringUtils.hasText(apiKey) || "none".equalsIgnoreCase(provider) || "mock".equalsIgnoreCase(apiKey)) {
            log.debug("No external AI API key configured. Using CareerMentorEngine.");
            CareerMentorEngine.MentorResponse mentorRes = mentorEngine.generateMentorResponse(userMessage, context);
            return ChatResponse.builder()
                    .response(mentorRes.reply())
                    .message(mentorRes.reply())
                    .suggestedPrompts(mentorRes.suggestedPrompts())
                    .build();
        }

        // Try calling external LLM
        try {
            log.info("Calling external AI provider [{}] using model [{}]...", provider, model);
            String aiGeneratedText = callExternalProvider(systemPrompt, userMessage, context);
            if (StringUtils.hasText(aiGeneratedText)) {
                List<String> suggestedPrompts = buildFollowUpPrompts(userMessage, context);
                return ChatResponse.builder()
                        .response(aiGeneratedText)
                        .message(aiGeneratedText)
                        .suggestedPrompts(suggestedPrompts)
                        .build();
            }
        } catch (Exception ex) {
            log.warn("External AI provider call failed ({}). Falling back smoothly to CareerMentorEngine.", ex.getMessage());
        }

        // Graceful fallback
        CareerMentorEngine.MentorResponse mentorRes = mentorEngine.generateMentorResponse(userMessage, context);
        return ChatResponse.builder()
                .response(mentorRes.reply())
                .message(mentorRes.reply())
                .suggestedPrompts(mentorRes.suggestedPrompts())
                .build();
    }

    private String callExternalProvider(String systemPrompt, String userMessage, StudentCareerContext context) throws Exception {
        if ("gemini".equalsIgnoreCase(geminiConfig.getProvider())) {
            return callGemini(systemPrompt, userMessage, context);
        } else {
            return callOpenAiCompatible(systemPrompt, userMessage, context);
        }
    }

    private String callGemini(String systemPrompt, String userMessage, StudentCareerContext context) throws Exception {
        String apiKey = geminiConfig.getApiKey();
        String model = geminiConfig.getModel();
        String endpoint = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String fullPrompt = systemPrompt + "\n\n" + context.toPromptContext() + "\n\nStudent's Question:\n" + userMessage;

        Map<String, Object> part = Map.of("text", fullPrompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> body = Map.of("contents", List.of(content));

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode candidates = root.path("candidates");
            if (candidates.isArray() && !candidates.isEmpty()) {
                JsonNode parts = candidates.get(0).path("content").path("parts");
                if (parts.isArray() && !parts.isEmpty()) {
                    return parts.get(0).path("text").asText();
                }
            }
        }
        return null;
    }

    private String callOpenAiCompatible(String systemPrompt, String userMessage, StudentCareerContext context) throws Exception {
        String apiKey = geminiConfig.getApiKey();
        String model = geminiConfig.getModel();
        String endpoint = "https://api.openai.com/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        List<Map<String, String>> messages = List.of(
                Map.of("role", "system", "content", systemPrompt + "\n\n" + context.toPromptContext()),
                Map.of("role", "user", "content", userMessage)
        );

        Map<String, Object> body = Map.of(
                "model", (model != null && model.startsWith("gpt")) ? model : "gpt-4o-mini",
                "messages", messages,
                "temperature", 0.7
        );

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(endpoint, HttpMethod.POST, requestEntity, String.class);

        if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && !choices.isEmpty()) {
                return choices.get(0).path("message").path("content").asText();
            }
        }
        return null;
    }

    private List<String> buildFollowUpPrompts(String userMessage, StudentCareerContext ctx) {
        String nextSkill = ctx.getRecommendedNextSkill() != null ? ctx.getRecommendedNextSkill() : "Spring Security";
        String lower = userMessage.toLowerCase();
        if (lower.contains("learn") || lower.contains("next")) {
            return List.of("Suggest a project using " + nextSkill, "Give me a 7 day learning plan", "Explain my skill gaps");
        } else if (lower.contains("project")) {
            return List.of("What should I learn next?", "How do I add this to my resume?", "Prepare me for interviews");
        } else {
            return List.of("What should I learn next?", "Explain my skill gaps", "Give me a 7 day learning plan");
        }
    }
}
