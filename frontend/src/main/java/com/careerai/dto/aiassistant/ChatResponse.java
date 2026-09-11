package com.careerai.dto.aiassistant;

import com.careerai.ai.assistant.dto.AIAssistantResponse;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

import java.util.List;

@ToString(callSuper = true)
@EqualsAndHashCode(callSuper = true)
@SuperBuilder
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatResponse extends AIAssistantResponse {

    public ChatResponse(String response, List<String> suggestedPrompts) {
        super(response, suggestedPrompts);
    }
}

