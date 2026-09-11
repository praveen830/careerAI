package com.careerai.dto.aiassistant;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public class ChatRequest extends AIChatRequest {

    public ChatRequest(String message) {
        super(message);
    }
}
