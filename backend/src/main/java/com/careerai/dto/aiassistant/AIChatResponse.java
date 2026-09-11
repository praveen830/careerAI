package com.careerai.dto.aiassistant;

import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
public class AIChatResponse extends ChatResponse {

    public AIChatResponse(String response, List<String> suggestedPrompts) {
        super(response, suggestedPrompts);
    }
}
