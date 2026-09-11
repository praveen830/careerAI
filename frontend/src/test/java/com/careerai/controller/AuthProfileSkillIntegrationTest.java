package com.careerai.controller;

import com.careerai.dto.auth.LoginRequest;
import com.careerai.dto.auth.RefreshTokenRequest;
import com.careerai.dto.auth.RegisterRequest;
import com.careerai.dto.profile.ProfileUpdateRequest;
import com.careerai.dto.skill.SkillRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
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
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthProfileSkillIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String jwtToken;
    private static String refreshToken;
    private static Long skillId;

    @Test
    @Order(1)
    public void testRegister_PasswordMismatch_ShouldFail() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Praveen Kumar")
                .email("praveen@example.com")
                .password("password123")
                .confirmPassword("wrongpass")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", containsString("Passwords do not match")));
    }

    @Test
    @Order(2)
    public void testRegister_Success() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Praveen Kumar")
                .email("praveen@example.com")
                .password("password123")
                .confirmPassword("password123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.data.user.id", notNullValue()))
                .andExpect(jsonPath("$.data.user.fullName", is("Praveen Kumar")))
                .andExpect(jsonPath("$.data.user.email", is("praveen@example.com")))
                .andExpect(jsonPath("$.data.fullName", is("Praveen Kumar")))
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        jwtToken = root.path("data").path("token").asText();
        refreshToken = root.path("data").path("refreshToken").asText();
    }

    @Test
    @Order(3)
    public void testRegister_DuplicateEmail_ShouldFail() throws Exception {
        RegisterRequest request = RegisterRequest.builder()
                .fullName("Praveen Kumar")
                .email("praveen@example.com")
                .password("password123")
                .confirmPassword("password123")
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @Order(4)
    public void testLogin_Success() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("praveen@example.com")
                .password("password123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.refreshToken", notNullValue()))
                .andExpect(jsonPath("$.data.user.fullName", is("Praveen Kumar")))
                .andExpect(jsonPath("$.data.user.email", is("praveen@example.com")));
    }

    @Test
    @Order(5)
    public void testLogin_InvalidCredentials_ShouldFail() throws Exception {
        LoginRequest request = LoginRequest.builder()
                .email("praveen@example.com")
                .password("badpassword")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @Order(6)
    public void testRefreshToken_Success() throws Exception {
        RefreshTokenRequest request = RefreshTokenRequest.builder()
                .refreshToken(refreshToken)
                .build();

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.user.email", is("praveen@example.com")));
    }

    @Test
    @Order(7)
    public void testGetProfile_Success() throws Exception {
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("Praveen Kumar")))
                .andExpect(jsonPath("$.data.email", is("praveen@example.com")))
                .andExpect(jsonPath("$.data.college", notNullValue()))
                .andExpect(jsonPath("$.data.degree", notNullValue()))
                .andExpect(jsonPath("$.data.currentYear", notNullValue()))
                .andExpect(jsonPath("$.data.cgpa", notNullValue()))
                .andExpect(jsonPath("$.data.graduationYear", notNullValue()));
    }

    @Test
    @Order(8)
    public void testUpdateProfile_Success() throws Exception {
        ProfileUpdateRequest update = ProfileUpdateRequest.builder()
                .fullName("Praveen K.")
                .college("GIET University")
                .degree("B.Tech")
                .branch("CSE")
                .currentYear("3")
                .cgpa(8.5)
                .graduationYear(2027)
                .phone("+91 9123456780")
                .build();

        mockMvc.perform(put("/api/profile")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.fullName", is("Praveen K.")))
                .andExpect(jsonPath("$.data.college", is("GIET University")))
                .andExpect(jsonPath("$.data.degree", is("B.Tech")))
                .andExpect(jsonPath("$.data.branch", is("CSE")))
                .andExpect(jsonPath("$.data.currentYear", is("3")))
                .andExpect(jsonPath("$.data.cgpa", is(8.5)))
                .andExpect(jsonPath("$.data.graduationYear", is(2027)));
    }

    @Test
    @Order(9)
    public void testGetSkills_ReturnsList() throws Exception {
        mockMvc.perform(get("/api/skills")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data", isA(Iterable.class)));
    }

    @Test
    @Order(10)
    public void testAddSkill_Success() throws Exception {
        SkillRequest request = SkillRequest.builder()
                .skill("Java")
                .proficiency("Advanced")
                .experience(2)
                .lastUsed("2026")
                .build();

        MvcResult result = mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.id", notNullValue()))
                .andExpect(jsonPath("$.data.skill", is("Java")))
                .andExpect(jsonPath("$.data.proficiency", is("Advanced")))
                .andExpect(jsonPath("$.data.experience", is(2)))
                .andExpect(jsonPath("$.data.lastUsed", is("2026")))
                .andReturn();

        JsonNode root = objectMapper.readTree(result.getResponse().getContentAsString());
        skillId = root.path("data").path("id").asLong();
    }

    @Test
    @Order(11)
    public void testAddSkill_InvalidProficiency_ShouldFail() throws Exception {
        SkillRequest request = SkillRequest.builder()
                .skill("Kotlin")
                .proficiency("SuperHero")
                .experience(1)
                .build();

        mockMvc.perform(post("/api/skills")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success", is(false)))
                .andExpect(jsonPath("$.message", is("Validation failed")));
    }

    @Test
    @Order(12)
    public void testUpdateSkill_Success() throws Exception {
        SkillRequest request = SkillRequest.builder()
                .skill("Java")
                .proficiency("Expert")
                .experience(3)
                .lastUsed("2026")
                .build();

        mockMvc.perform(put("/api/skills/" + skillId)
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.data.proficiency", is("Expert")))
                .andExpect(jsonPath("$.data.experience", is(3)));
    }

    @Test
    @Order(13)
    public void testDataIsolation_AnotherUserCannotModifySkill() throws Exception {
        // Register User B
        RegisterRequest userB = RegisterRequest.builder()
                .fullName("User B")
                .email("userb@example.com")
                .password("password123")
                .confirmPassword("password123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userB)))
                .andExpect(status().isCreated())
                .andReturn();

        String tokenB = objectMapper.readTree(result.getResponse().getContentAsString())
                .path("data").path("token").asText();

        // User B tries to update User A's skill -> 404
        SkillRequest updateAttempt = SkillRequest.builder()
                .skill("Java")
                .proficiency("Beginner")
                .experience(1)
                .build();

        mockMvc.perform(put("/api/skills/" + skillId)
                        .header("Authorization", "Bearer " + tokenB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateAttempt)))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));

        // User B tries to delete User A's skill -> 404
        mockMvc.perform(delete("/api/skills/" + skillId)
                        .header("Authorization", "Bearer " + tokenB))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success", is(false)));
    }

    @Test
    @Order(14)
    public void testDeleteSkill_Success() throws Exception {
        mockMvc.perform(delete("/api/skills/" + skillId)
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)));
    }
}
