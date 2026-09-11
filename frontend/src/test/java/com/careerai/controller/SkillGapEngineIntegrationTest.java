package com.careerai.controller;

import com.careerai.dto.auth.LoginRequest;
import com.careerai.dto.auth.RegisterRequest;
import com.careerai.dto.career.CareerGoalSelectionRequest;
import com.careerai.dto.skill.SkillRequest;
import com.careerai.dto.skillgap.SkillGapRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class SkillGapEngineIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String studentAToken;
    private String studentBToken;

    @BeforeAll
    public void setup() throws Exception {
        // Register Student A
        RegisterRequest regA = RegisterRequest.builder()
                .fullName("Student Alpha")
                .email("student.alpha@test.com")
                .password("Password123!")
                .confirmPassword("Password123!")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regA)))
                .andExpect(status().isCreated());

        MvcResult loginResultA = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("student.alpha@test.com", "Password123!"))))
                .andExpect(status().isOk())
                .andReturn();

        studentAToken = objectMapper.readTree(loginResultA.getResponse().getContentAsString())
                .path("data").path("token").asText();

        // Register Student B
        RegisterRequest regB = RegisterRequest.builder()
                .fullName("Student Beta")
                .email("student.beta@test.com")
                .password("Password123!")
                .confirmPassword("Password123!")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(regB)))
                .andExpect(status().isCreated());

        MvcResult loginResultB = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new LoginRequest("student.beta@test.com", "Password123!"))))
                .andExpect(status().isOk())
                .andReturn();

        studentBToken = objectMapper.readTree(loginResultB.getResponse().getContentAsString())
                .path("data").path("token").asText();

        // Setup Student A's career goal: JAVA_FULL_STACK_DEVELOPER
        CareerGoalSelectionRequest goalA = CareerGoalSelectionRequest.builder()
                .careerGoal("JAVA_FULL_STACK_DEVELOPER")
                .build();

        mockMvc.perform(put("/api/career-goals/current")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(goalA)))
                .andExpect(status().isOk());

        // Add varying skills to Student A for Edge Cases
        // Case 1: Skill matches requirement (Java level 4 vs required 4 -> gap 0, EXCELLENT)
        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(SkillRequest.builder()
                                .skill("Java")
                                .proficiency("Advanced") // Level 4
                                .experience(3)
                                .build())))
                .andExpect(status().isCreated());

        // Case 2: Small gap (Spring Boot level 3 vs required 4 -> gap 1, GOOD)
        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(SkillRequest.builder()
                                .skill("Spring Boot")
                                .proficiency("Intermediate") // Level 3
                                .experience(2)
                                .build())))
                .andExpect(status().isCreated());

        // Case 3: Moderate gap (Spring Security level 2 vs required 4 -> gap 2, MODERATE)
        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(SkillRequest.builder()
                                .skill("Spring Security")
                                .proficiency("Basic") // Level 2
                                .experience(1)
                                .build())))
                .andExpect(status().isCreated());

        // Case 4: Critical gap (Angular level 1 vs required 3 -> gap 2 MODERATE, but Docker has required 3 and no skill -> gap 3, CRITICAL)
        // Let's add REST API with Beginner (level 1 vs required 4 -> gap 3, CRITICAL)
        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(SkillRequest.builder()
                                .skill("REST API")
                                .proficiency("Beginner") // Level 1
                                .experience(1)
                                .build())))
                .andExpect(status().isCreated());
        // Note: Docker, MySQL, Git are NOT added for Student A (Case 5: Student does not have skill -> currentLevel = 0)
    }

    @Test
    @Order(1)
    @DisplayName("GET /api/skill-gap - Exact contract properties")
    public void testGetSkillGap_ExactContractProperties() throws Exception {
        mockMvc.perform(get("/api/skill-gap")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.message", notNullValue()))
                .andExpect(jsonPath("$.data.careerGoal", is("JAVA_FULL_STACK_DEVELOPER")))
                .andExpect(jsonPath("$.data.readinessScore", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps", hasSize(greaterThanOrEqualTo(5))))
                .andExpect(jsonPath("$.data.skillGaps[0].skillName", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps[0].requiredLevel", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps[0].currentLevel", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps[0].gapLevel", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps[0].severity", notNullValue()))
                // Verify pure JSON contract (no legacy aliases leaking as JSON properties)
                .andExpect(jsonPath("$.data.skillGaps[0].skill").doesNotExist())
                .andExpect(jsonPath("$.data.skillGaps[0].status").doesNotExist())
                .andExpect(jsonPath("$.data.targetCareer").doesNotExist())
                .andExpect(jsonPath("$.data.gaps").doesNotExist());
    }

    @Test
    @Order(2)
    @DisplayName("POST /api/skill-gap/analyze - Re-analysis calculation")
    public void testAnalyzeSkillGap_CalculationsAndOverride() throws Exception {
        // Run analysis without body
        mockMvc.perform(post("/api/skill-gap/analyze")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.careerGoal", is("JAVA_FULL_STACK_DEVELOPER")))
                .andExpect(jsonPath("$.data.readinessScore", greaterThan(0)))
                .andExpect(jsonPath("$.data.readinessScore", lessThanOrEqualTo(100)));

        // Run analysis with goal override body: FRONTEND_DEVELOPER
        SkillGapRequest request = SkillGapRequest.builder()
                .careerGoal("FRONTEND_DEVELOPER")
                .build();

        mockMvc.perform(post("/api/skill-gap/analyze")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.careerGoal", is("FRONTEND_DEVELOPER")));

        // Restore Student A back to JAVA_FULL_STACK_DEVELOPER so subsequent GET tests see correct cached gaps
        mockMvc.perform(post("/api/skill-gap/analyze")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SkillGapRequest("JAVA_FULL_STACK_DEVELOPER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.careerGoal", is("JAVA_FULL_STACK_DEVELOPER")));
    }

    @Test
    @Order(3)
    @DisplayName("Edge Case 1: Skill matches requirement (gapLevel = 0 -> EXCELLENT)")
    public void testEdgeCase1_SkillMatchesRequirement() throws Exception {
        // Re-analyze for Java Full Stack
        mockMvc.perform(post("/api/skill-gap/analyze")
                        .header("Authorization", "Bearer " + studentAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new SkillGapRequest("JAVA_FULL_STACK_DEVELOPER"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Java')].requiredLevel", hasItem(4)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Java')].currentLevel", hasItem(4)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Java')].gapLevel", hasItem(0)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Java')].severity", hasItem("EXCELLENT")));
    }

    @Test
    @Order(4)
    @DisplayName("Edge Case 2: Small gap (gapLevel = 1 -> GOOD)")
    public void testEdgeCase2_SmallGap() throws Exception {
        mockMvc.perform(get("/api/skill-gap")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Spring Boot')].requiredLevel", hasItem(4)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Spring Boot')].currentLevel", hasItem(3)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Spring Boot')].gapLevel", hasItem(1)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Spring Boot')].severity", hasItem("GOOD")));
    }

    @Test
    @Order(5)
    @DisplayName("Edge Case 3: Moderate gap (gapLevel = 2 -> MODERATE)")
    public void testEdgeCase3_ModerateGap() throws Exception {
        mockMvc.perform(get("/api/skill-gap")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Spring Security')].requiredLevel", hasItem(4)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Spring Security')].currentLevel", hasItem(2)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Spring Security')].gapLevel", hasItem(2)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Spring Security')].severity", hasItem("MODERATE")));
    }

    @Test
    @Order(6)
    @DisplayName("Edge Case 4: Critical gap (gapLevel >= 3 -> CRITICAL)")
    public void testEdgeCase4_CriticalGap() throws Exception {
        mockMvc.perform(get("/api/skill-gap")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'REST API')].requiredLevel", hasItem(4)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'REST API')].currentLevel", hasItem(1)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'REST API')].gapLevel", hasItem(3)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'REST API')].severity", hasItem("CRITICAL")));
    }

    @Test
    @Order(7)
    @DisplayName("Edge Case 5: Student does not have required skill (currentLevel = 0, gapLevel = requiredLevel)")
    public void testEdgeCase5_StudentDoesNotHaveSkill() throws Exception {
        mockMvc.perform(get("/api/skill-gap")
                        .header("Authorization", "Bearer " + studentAToken))
                .andExpect(status().isOk())
                // Docker was never added by Student A -> currentLevel must be 0, requiredLevel = 3, gapLevel = 3, CRITICAL
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Docker')].currentLevel", hasItem(0)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Docker')].requiredLevel", hasItem(3)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Docker')].gapLevel", hasItem(3)))
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Docker')].severity", hasItem("CRITICAL")));
    }

    @Test
    @Order(8)
    @DisplayName("Edge Case 6: No authenticated user (401 Unauthorized)")
    public void testEdgeCase6_UnauthenticatedRequest() throws Exception {
        mockMvc.perform(get("/api/skill-gap"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));

        mockMvc.perform(post("/api/skill-gap/analyze"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @Order(9)
    @DisplayName("Edge Case 7: Cross-user data isolation (Student A vs Student B)")
    public void testEdgeCase7_CrossUserDataIsolation() throws Exception {
        // Student B has NO skills added yet
        mockMvc.perform(get("/api/skill-gap")
                        .header("Authorization", "Bearer " + studentBToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                // Student B should have currentLevel = 0 for Java (Student A has level 4)
                .andExpect(jsonPath("$.data.skillGaps[?(@.skillName == 'Java')].currentLevel", hasItem(0)))
                .andExpect(jsonPath("$.data.readinessScore", is(0)));
    }
}
