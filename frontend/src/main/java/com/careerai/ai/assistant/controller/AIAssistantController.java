package com.careerai.ai.assistant.controller;

import com.careerai.ai.assistant.dto.AIAssistantRequest;
import com.careerai.ai.assistant.dto.AIAssistantResponse;
import com.careerai.ai.assistant.service.AIAssistantService;
import com.careerai.dto.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai-assistant")
@RequiredArgsConstructor
public class AIAssistantController {

    private final AIAssistantService aiAssistantService;

    @PostMapping("/chat")
    public ResponseEntity<ApiResponse<AIAssistantResponse>> chat(@Valid @RequestBody AIAssistantRequest request) {
        AIAssistantResponse response = aiAssistantService.processChat(request);
        return ResponseEntity.ok(ApiResponse.success("Assistant response generated", response));
    }
}
