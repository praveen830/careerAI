package com.careerai.controller;

import com.careerai.dto.aiassistant.AIChatRequest;
import com.careerai.dto.auth.RegisterRequest;
import com.careerai.dto.skill.SkillRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class DashboardAndAIAssistantIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String user1Token;
    private String user2Token;

    @BeforeAll
    public void setup() throws Exception {
        // Register User 1
        RegisterRequest register1 = RegisterRequest.builder()
                .fullName("Praveen Kumar")
                .email("praveen.dashboard@example.com")
                .password("password123")
                .confirmPassword("password123")
                .build();

        MvcResult result1 = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register1)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode root1 = objectMapper.readTree(result1.getResponse().getContentAsString());
        user1Token = root1.path("data").path("token").asText();

        // Register User 2
        RegisterRequest register2 = RegisterRequest.builder()
                .fullName("Second Student")
                .email("student2@example.com")
                .password("password123")
                .confirmPassword("password123")
                .build();

        MvcResult result2 = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register2)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode root2 = objectMapper.readTree(result2.getResponse().getContentAsString());
        user2Token = root2.path("data").path("token").asText();

        // Add a skill for User 1
        SkillRequest skillReq = SkillRequest.builder()
                .skill("Java")
                .proficiency("Advanced")
                .experience(2)
                .lastUsed("2026")
                .build();

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(skillReq)))
                .andExpect(status().isCreated());
    }

    // -------------------------------------------------------------
    // 1. Dashboard API Tests
    // -------------------------------------------------------------

    @Test
    @Order(1)
    public void testGetDashboardUnauthorized() throws Exception {
        mockMvc.perform(get("/api/dashboard"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(2)
    public void testGetDashboardSuccess() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .header("Authorization", "Bearer " + user1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", notNullValue()))
                .andExpect(jsonPath("$.data.studentName", is("Praveen Kumar")))
                .andExpect(jsonPath("$.data.careerGoal", notNullValue()))
                .andExpect(jsonPath("$.data.readinessScore", notNullValue()))
                .andExpect(jsonPath("$.data.skills", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.skills[0].skill", is("Java")))
                .andExpect(jsonPath("$.data.skillGaps", notNullValue()))
                .andExpect(jsonPath("$.data.roadmapProgress", notNullValue()))
                .andExpect(jsonPath("$.data.recommendedNextSkill", notNullValue()))
                // Verify forbidden legacy names do NOT appear at top data level
                .andExpect(jsonPath("$.data.student").doesNotExist())
                .andExpect(jsonPath("$.data.career").doesNotExist())
                .andExpect(jsonPath("$.data.readiness").doesNotExist())
                .andExpect(jsonPath("$.data.nextSkill").doesNotExist())
                .andExpect(jsonPath("$.data.progress").doesNotExist());
    }

    @Test
    @Order(3)
    public void testDashboardUserDataIsolation() throws Exception {
        // User 2 should only see User 2's data and not User 1's "Java" skill or student name
        mockMvc.perform(get("/api/dashboard")
                        .header("Authorization", "Bearer " + user2Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.studentName", is("Second Student")))
                .andExpect(jsonPath("$.data.studentName", not("Praveen Kumar")))
                .andExpect(jsonPath("$.data.skills[*].skill", not(hasItem("Java"))));
    }

    // -------------------------------------------------------------
    // 2. AI Assistant API Tests
    // -------------------------------------------------------------

    @Test
    @Order(4)
    public void testAIChatUnauthorized() throws Exception {
        AIChatRequest req = AIChatRequest.builder().message("What should I learn next?").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Order(5)
    public void testAIChatBlankMessageValidation() throws Exception {
        AIChatRequest req = AIChatRequest.builder().message("   ").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @Order(6)
    public void testAIChatWhatShouldILearnNext() throws Exception {
        AIChatRequest req = AIChatRequest.builder().message("What should I learn next?").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.response", notNullValue()))
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("learn")))
                .andExpect(jsonPath("$.data.suggestedPrompts", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @Order(7)
    public void testAIChatSuggestProjects() throws Exception {
        AIChatRequest req = AIChatRequest.builder().message("Suggest a project for me to build").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("project")))
                .andExpect(jsonPath("$.data.suggestedPrompts", notNullValue()));
    }

    @Test
    @Order(8)
    public void testAIChatInterviewPrep() throws Exception {
        AIChatRequest req = AIChatRequest.builder().message("Give me interview questions").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("Interview")));
    }

    @Test
    @Order(9)
    public void testAIChatSevenDayStudyPlan() throws Exception {
        AIChatRequest req = AIChatRequest.builder().message("Give me a 7 day learning plan").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("Day 1")))
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("Day 7")));
    }

    @Test
    @Order(10)
    public void testAIChatSkillGapsExplanation() throws Exception {
        AIChatRequest req = AIChatRequest.builder().message("Explain my skill gaps").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("Gap")));
    }

    @Test
    @Order(11)
    public void testAIChatReadinessEvaluation() throws Exception {
        AIChatRequest req = AIChatRequest.builder().message("Am I ready for my career goal?").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("Readiness")));
    }

    @Test
    @Order(12)
    public void testAIChatStudentDataIsolation() throws Exception {
        // User 1 requests guidance -> mentions Praveen
        AIChatRequest req = AIChatRequest.builder().message("What should I learn next?").build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("Praveen")));

        // User 2 requests guidance -> MUST NOT mention Praveen, mentions Second Student
        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user2Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.response", not(containsStringIgnoringCase("Praveen"))))
                .andExpect(jsonPath("$.data.response", containsStringIgnoringCase("Second Student")));
    }

    @Test
    @Order(13)
    public void testAIAssistantExplicitContract() throws Exception {
        com.careerai.ai.assistant.dto.AIAssistantRequest request = com.careerai.ai.assistant.dto.AIAssistantRequest.builder()
                .message("What should I learn next?")
                .build();

        mockMvc.perform(post("/api/ai-assistant/chat")
                        .header("Authorization", "Bearer " + user1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", is("Assistant response generated")))
                .andExpect(jsonPath("$.data.response", notNullValue()))
                .andExpect(jsonPath("$.data.suggestedPrompts", notNullValue()));
    }
}

