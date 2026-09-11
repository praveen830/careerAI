package com.careerai.dto.aiassistant;

import com.careerai.ai.assistant.dto.AIAssistantRequest;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
public class AIChatRequest extends AIAssistantRequest {

    public AIChatRequest(String message) {
        super(message);
    }
}

