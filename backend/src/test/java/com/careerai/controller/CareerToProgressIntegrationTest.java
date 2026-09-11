package com.careerai.controller;

import com.careerai.dto.auth.LoginRequest;
import com.careerai.dto.auth.RegisterRequest;
import com.careerai.dto.career.CareerGoalSelectionRequest;
import com.careerai.dto.jobanalyzer.JobAnalysisRequest;
import com.careerai.dto.progress.ProgressUpdateRequest;
import com.careerai.dto.resume.ResumeAnalysisRequest;
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
import org.springframework.mock.web.MockMultipartFile;
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
public class CareerToProgressIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String token;
    private Long roadmapId;
    private Long progressId;

    @BeforeAll
    public void setup() throws Exception {
        RegisterRequest register = RegisterRequest.builder()
                .fullName("Praveen Kumar")
                .email("career_tester@example.com")
                .password("password123")
                .confirmPassword("password123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isCreated())
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        token = root.path("data").path("token").asText();

        // Set career goal so skill gap engine has a benchmark to compare against
        CareerGoalSelectionRequest goalReq = CareerGoalSelectionRequest.builder()
                .careerGoal("JAVA_FULL_STACK_DEVELOPER")
                .build();
        mockMvc.perform(put("/api/career-goals/current")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(goalReq)))
                .andExpect(status().isOk());

        // Add skills so readinessScore > 0 when analyzeSkillGap runs
        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(SkillRequest.builder()
                                .skill("Java").proficiency("Advanced").experience(2).build())))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(SkillRequest.builder()
                                .skill("Spring Boot").proficiency("Intermediate").experience(1).build())))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(SkillRequest.builder()
                                .skill("MySQL").proficiency("Basic").experience(1).build())))
                .andExpect(status().isCreated());
    }

    // -------------------------------------------------------------
    // 5. Career Goal Tests
    // -------------------------------------------------------------

    @Test
    @Order(1)
    public void testGetCareerGoals_ReturnsList() throws Exception {
        mockMvc.perform(get("/api/career-goals")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @Order(2)
    public void testGetCurrentCareerGoal_ReturnsSelected() throws Exception {
        mockMvc.perform(get("/api/career-goals/current")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.careerGoal", notNullValue()))
                .andExpect(jsonPath("$.data.selected", is(true)));
    }

    @Test
    @Order(3)
    public void testUpdateCurrentCareerGoal_Success() throws Exception {
        CareerGoalSelectionRequest request = CareerGoalSelectionRequest.builder()
                .careerGoal("JAVA_FULL_STACK_DEVELOPER")
                .build();

        mockMvc.perform(put("/api/career-goals/current")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.careerGoal", is("JAVA_FULL_STACK_DEVELOPER")))
                .andExpect(jsonPath("$.data.careerName", is("Java Full Stack Developer")))
                .andExpect(jsonPath("$.data.selected", is(true)));
    }

    // -------------------------------------------------------------
    // 6. Skill Gap Tests
    // -------------------------------------------------------------

    @Test
    @Order(4)
    public void testGetSkillGap_ExactContractProperties() throws Exception {
        mockMvc.perform(get("/api/skill-gap")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.careerGoal", notNullValue()))
                .andExpect(jsonPath("$.data.readinessScore", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.data.skillGaps[0].skillName", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps[0].requiredLevel", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps[0].currentLevel", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps[0].gapLevel", notNullValue()))
                .andExpect(jsonPath("$.data.skillGaps[0].severity", notNullValue()));
    }

    @Test
    @Order(5)
    public void testAnalyzeSkillGap_CalculatesAccurately() throws Exception {
        mockMvc.perform(post("/api/skill-gap/analyze")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.careerGoal", is("JAVA_FULL_STACK_DEVELOPER")))
                .andExpect(jsonPath("$.data.readinessScore", greaterThan(0)))
                .andExpect(jsonPath("$.data.skillGaps", hasSize(greaterThanOrEqualTo(5))));
    }

    // -------------------------------------------------------------
    // 7. Roadmap Tests
    // -------------------------------------------------------------

    @Test
    @Order(6)
    public void testGetRoadmap_ExactMilestoneFields() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/roadmap")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data[0].id", notNullValue()))
                .andExpect(jsonPath("$.data[0].title", notNullValue()))
                .andExpect(jsonPath("$.data[0].description", notNullValue()))
                .andExpect(jsonPath("$.data[0].status", notNullValue()))
                .andExpect(jsonPath("$.data[0].progress", notNullValue()))
                .andExpect(jsonPath("$.data[0].estimatedDays", notNullValue()))
                .andExpect(jsonPath("$.data[0].orderIndex", notNullValue()))
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        roadmapId = root.path("data").get(0).path("id").asLong();
    }

    @Test
    @Order(7)
    public void testCompleteRoadmapItem_SetsStatusCompletedAndProgress100() throws Exception {
        mockMvc.perform(put("/api/roadmap/" + roadmapId + "/complete")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.status", is("COMPLETED")))
                .andExpect(jsonPath("$.data.progress", is(100)));
    }

    // -------------------------------------------------------------
    // 8. Projects Tests
    // -------------------------------------------------------------

    @Test
    @Order(8)
    public void testGetProjects_ContainsTechnologiesList() throws Exception {
        mockMvc.perform(get("/api/projects")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.data[0].technologies", isA(Iterable.class)))
                .andExpect(jsonPath("$.data[0].difficulty", notNullValue()))
                .andExpect(jsonPath("$.data[0].duration", notNullValue()))
                .andExpect(jsonPath("$.data[0].reason", notNullValue()));
    }

    @Test
    @Order(9)
    public void testGetRecommendedProjects_Success() throws Exception {
        mockMvc.perform(get("/api/projects/recommended")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));
    }

    // -------------------------------------------------------------
    // 9. Resume Analyzer Tests
    // -------------------------------------------------------------

    @Test
    @Order(10)
    public void testUploadResume_PdfValidation_Success() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "praveen_resume.pdf",
                "application/pdf",
                "%PDF-1.4 Mock Java Spring Boot MySQL developer resume content".getBytes()
        );

        mockMvc.perform(multipart("/api/resume/upload")
                        .file(file)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fileName", is("praveen_resume.pdf")))
                .andExpect(jsonPath("$.data.resumeScore", greaterThan(0)))
                .andExpect(jsonPath("$.data.skillsFound", isA(Iterable.class)))
                .andExpect(jsonPath("$.data.missingSkills", isA(Iterable.class)))
                .andExpect(jsonPath("$.data.suggestions", isA(Iterable.class)));
    }

    @Test
    @Order(11)
    public void testGetResume_Success() throws Exception {
        mockMvc.perform(get("/api/resume")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fileName", notNullValue()))
                .andExpect(jsonPath("$.data.resumeScore", notNullValue()));
    }

    // -------------------------------------------------------------
    // 10. Job Analyzer Tests
    // -------------------------------------------------------------

    @Test
    @Order(12)
    public void testAnalyzeJob_ExactResponseProperties() throws Exception {
        JobAnalysisRequest request = JobAnalysisRequest.builder()
                .jobDescription("Looking for a Senior Java Developer with Spring Boot, MySQL, REST API, Docker, and Kubernetes experience.")
                .build();

        mockMvc.perform(post("/api/job-analyzer/analyze")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.matchScore", notNullValue()))
                .andExpect(jsonPath("$.data.matchedSkills", isA(Iterable.class)))
                .andExpect(jsonPath("$.data.missingSkills", isA(Iterable.class)));
    }

    @Test
    @Order(13)
    public void testGetJobHistory_ReturnsUserHistory() throws Exception {
        mockMvc.perform(get("/api/job-analyzer/history")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))));
    }

    // -------------------------------------------------------------
    // 11. Progress Tests
    // -------------------------------------------------------------

    @Test
    @Order(14)
    public void testGetProgress_ExactProperties() throws Exception {
        MvcResult result = mockMvc.perform(get("/api/progress")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.overallProgress", notNullValue()))
                .andExpect(jsonPath("$.data.projectsCompleted", notNullValue()))
                .andExpect(jsonPath("$.data.skillsImproved", notNullValue()))
                .andExpect(jsonPath("$.data.roadmapCompleted", notNullValue()))
                .andExpect(jsonPath("$.data.learningStreak", notNullValue()))
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        progressId = root.path("data").path("id").asLong();
    }

    @Test
    @Order(15)
    public void testUpdateProgress_Success() throws Exception {
        ProgressUpdateRequest update = ProgressUpdateRequest.builder()
                .overallProgress(75)
                .projectsCompleted(4)
                .skillsImproved(8)
                .roadmapCompleted(5)
                .learningStreak(14)
                .build();

        mockMvc.perform(put("/api/progress/" + progressId)
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.overallProgress", is(75)))
                .andExpect(jsonPath("$.data.learningStreak", is(14)));
    }
}
