package com.careerai.ai.assistant.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AIAssistantResponse {

    private String response;
    private String message;
    private List<String> suggestedPrompts;

    public AIAssistantResponse(String response, List<String> suggestedPrompts) {
        this.response = response;
        this.message = response;
        this.suggestedPrompts = suggestedPrompts;
    }

    public String getMessage() {
        return message != null ? message : response;
    }

    public void setMessage(String message) {
        this.message = message;
        if (this.response == null) {
            this.response = message;
        }
    }

    public String getResponse() {
        return response != null ? response : message;
    }

    public void setResponse(String response) {
        this.response = response;
        if (this.message == null) {
            this.message = response;
        }
    }
}
