package com.careerai.service.ai;

import com.careerai.dto.aiassistant.StudentCareerContext;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Intelligent context-aware mentor engine.
 * Generates personalized, beginner-friendly career guidance strictly adhering to
 * the student's real CareerAI data (readiness score, gaps, roadmap, projects, streak).
 */
@Service
public class CareerMentorEngine {

    public record MentorResponse(String reply, List<String> suggestedPrompts) {}

    public MentorResponse generateMentorResponse(String message, StudentCareerContext ctx) {
        String query = message != null ? message.trim().toLowerCase() : "";

        String studentName = ctx.getFullName() != null ? ctx.getFullName() : "Student";
        String goalTitle = ctx.getCareerGoal() != null ? ctx.getCareerGoal() : "Software Engineer";
        int readiness = ctx.getReadinessScore() != null ? ctx.getReadinessScore() : 0;
        int roadmapProgress = ctx.getOverallRoadmapProgress() != null ? ctx.getOverallRoadmapProgress() : 0;
        String nextSkill = ctx.getRecommendedNextSkill() != null ? ctx.getRecommendedNextSkill() : "Core Architecture";
        String nextMilestone = ctx.getNextMilestone() != null ? ctx.getNextMilestone() : "Current Milestone";

        List<String> criticalGaps = ctx.getSkillGaps().stream()
                .filter(g -> "CRITICAL".equalsIgnoreCase(g.getSeverity()))
                .map(StudentCareerContext.GapSummary::getSkillName)
                .collect(Collectors.toList());

        String criticalSummary = !criticalGaps.isEmpty() ? String.join(", ", criticalGaps) : nextSkill;

        List<String> currentSkillNames = ctx.getSkills().stream()
                .map(StudentCareerContext.SkillSummary::getSkillName)
                .collect(Collectors.toList());
        String currentSkillsSummary = !currentSkillNames.isEmpty() ? String.join(", ", currentSkillNames) : "Core CS Fundamentals";

        // =========================================================================
        // 1. Career Guidance & What to Learn Next
        // =========================================================================
        if (query.contains("learn next") || query.contains("what should i learn") || query.contains("next skill") || query.contains("focus on first")) {
            String explanation = generateWhySkillImportant(nextSkill, goalTitle);
            String reply = "Hi " + studentName + "! Based on your current career goal of **" + goalTitle + "** and authoritative readiness score of **" + readiness + "%**, the single highest-priority skill you should learn next is **" + nextSkill + "**.\n\n"
                    + "### Why " + nextSkill + "?\n"
                    + "It represents your most critical skill gap right now. Closing this gap will provide the fastest boost toward becoming job-ready and aligns with your upcoming roadmap milestone: *" + nextMilestone + "*.\n\n"
                    + explanation + "\n\n"
                    + "### 5-Day Fast-Track Plan:\n"
                    + "- **Day 1:** Core concepts & architecture overview of " + nextSkill + "\n"
                    + "- **Day 2:** Configuration, basic setup, and standard libraries\n"
                    + "- **Day 3:** Hands-on lab implementing practical workflows\n"
                    + "- **Day 4:** Error handling, edge cases, and industry security patterns\n"
                    + "- **Day 5:** Integrate " + nextSkill + " into your existing projects";

            List<String> prompts = Arrays.asList(
                    "Give me a 7 day learning plan",
                    "Suggest a project using " + nextSkill,
                    "Explain my skill gaps"
            );
            return new MentorResponse(reply, prompts);
        }

        // =========================================================================
        // 2. Readiness Score & Readiness Evaluation
        // =========================================================================
        if (query.contains("ready") || query.contains("readiness") || query.contains("am i ready") || query.contains("why is my readiness")) {
            String readinessTier;
            String advice;
            if (readiness >= 80) {
                readinessTier = "Job-Ready Candidate";
                advice = "You have covered most benchmark competencies. Focus heavily on full-scale portfolio projects and mock interviews.";
            } else if (readiness >= 50) {
                readinessTier = "Developing Associate";
                advice = "You have a solid foundation in (" + currentSkillsSummary + "), but resolving your critical gaps (" + criticalSummary + ") is essential to cross the 80% industry benchmark.";
            } else {
                readinessTier = "Foundational Learner";
                advice = "You are in the active building phase. Concentrate on one skill at a time starting with **" + nextSkill + "** before attempting complex multi-tier projects.";
            }

            String reply = "### Career Readiness Assessment for " + studentName + "\n\n"
                    + "- **Target Career Path:** " + goalTitle + "\n"
                    + "- **Authoritative Readiness Score:** **" + readiness + "%** (" + readinessTier + ")\n"
                    + "- **Roadmap Completion:** **" + roadmapProgress + "%**\n"
                    + "- **Learning Streak:** **" + ctx.getLearningStreak() + " days** 🔥\n\n"
                    + "### Assessment Summary:\n"
                    + advice + "\n\n"
                    + "Your readiness score is calculated directly by comparing your verified proficiencies against industry benchmark requirements for **" + goalTitle + "**. Your primary bottleneck is **" + criticalSummary + "**.";

            List<String> prompts = Arrays.asList(
                    "What should I learn next?",
                    "Explain my skill gaps",
                    "What project should I build next?"
            );
            return new MentorResponse(reply, prompts);
        }

        // =========================================================================
        // 3. Skill Gaps Explanation
        // =========================================================================
        if (query.contains("gap") || query.contains("missing") || query.contains("weak")) {
            StringBuilder sb = new StringBuilder();
            sb.append("### Your Verified Skill Gap Breakdown\n\n");
            sb.append("For your target path as a **").append(goalTitle).append("**, here is how your skills compare against required industry benchmarks:\n\n");

            if (ctx.getSkillGaps().isEmpty()) {
                sb.append("✅ **Congratulations!** You currently have no critical skill gaps recorded.\n");
            } else {
                for (StudentCareerContext.GapSummary g : ctx.getSkillGaps()) {
                    String badge = "CRITICAL".equalsIgnoreCase(g.getSeverity()) ? "🔴 CRITICAL"
                            : "MODERATE".equalsIgnoreCase(g.getSeverity()) ? "🟡 MODERATE" : "🟢 GOOD";
                    sb.append("- **").append(g.getSkillName()).append("** — ").append(badge)
                      .append("\n  - *Current Proficiency:* Level ").append(g.getCurrentLevel())
                      .append(" | *Required Benchmark:* Level ").append(g.getRequiredLevel())
                      .append(" (Gap: ").append(g.getGapLevel()).append(")\n");
                }
            }

            sb.append("\n**Actionable Advice:** Tackle **").append(nextSkill)
              .append("** first. It holds the highest gap weight and resolving it will accelerate your roadmap progress.");

            List<String> prompts = Arrays.asList(
                    "What should I learn next?",
                    "Why is " + nextSkill + " important?",
                    "Give me a 7 day learning plan"
            );
            return new MentorResponse(sb.toString(), prompts);
        }

        // =========================================================================
        // 4. "Why is [Skill] important?"
        // =========================================================================
        if (query.contains("why is") || query.contains("why should i learn")) {
            String targetSkill = extractSkillFromQuery(query, ctx);
            String explanation = generateWhySkillImportant(targetSkill, goalTitle);

            String reply = "### Why " + targetSkill + " is Essential for " + goalTitle + "\n\n"
                    + explanation + "\n\n"
                    + "### Recommended Step-by-Step Learning Progression:\n"
                    + "1. **Core Foundations:** Understand fundamental principles and problems it solves.\n"
                    + "2. **Standard API / Framework Usage:** Implement standard boilerplate and real-world endpoints.\n"
                    + "3. **Security & Production Hardening:** Apply authentication, validations, and tests.\n"
                    + "4. **Portfolio Integration:** Embed " + targetSkill + " into one of your completed projects.";

            List<String> prompts = Arrays.asList(
                    "What should I learn next?",
                    "Suggest a project using " + targetSkill,
                    "What should I study today?"
            );
            return new MentorResponse(reply, prompts);
        }

        // =========================================================================
        // 5. Roadmap & Study Plans (Today / 7-Day Plan)
        // =========================================================================
        if (query.contains("today") || query.contains("study today") || query.contains("7 day") || query.contains("plan") || query.contains("roadmap")) {
            if (query.contains("7 day") || query.contains("week") || query.contains("plan")) {
                String reply = "### 📅 7-Day Personalized Career Sprint for " + studentName + "\n\n"
                        + "Focusing on your goal (**" + goalTitle + "**) and top gap (**" + nextSkill + "**):\n\n"
                        + "- **Day 1: Architecture & Foundations** — Read documentation and write high-level architectural notes for " + nextSkill + ".\n"
                        + "- **Day 2: Hello World & Configuration** — Build a sandbox workspace and configure initial modules.\n"
                        + "- **Day 3: Core Business Logic** — Implement essential CRUD / processing pipelines.\n"
                        + "- **Day 4: Security & Validation** — Add authentication, defensive error handling, and boundary checks.\n"
                        + "- **Day 5: Unit & Integration Testing** — Write automated test suites to verify reliability.\n"
                        + "- **Day 6: Portfolio Integration** — Connect " + nextSkill + " with your frontend or database tier.\n"
                        + "- **Day 7: Review & Mock Interview Drill** — Test yourself on typical interview questions for " + nextSkill + ".";

                List<String> prompts = Arrays.asList(
                        "What should I study today?",
                        "Suggest a project for me",
                        "Prepare me for a " + goalTitle + " interview"
                );
                return new MentorResponse(reply, prompts);
            } else {
                String reply = "### 🎯 Daily Focus for Today\n\n"
                        + "Good morning " + studentName + "! With a **" + ctx.getLearningStreak() + "-day learning streak** active, let's keep the momentum going!\n\n"
                        + "- **Active Milestone:** " + nextMilestone + "\n"
                        + "- **Key Focus Skill:** **" + nextSkill + "**\n\n"
                        + "**Today's Recommended 2-Hour Study Plan:**\n"
                        + "1. **30 Mins:** Deep-dive into core principles of " + nextSkill + ".\n"
                        + "2. **60 Mins:** Code a small working proof-of-concept repository.\n"
                        + "3. **30 Mins:** Document your takeaways and push your code to Git.";

                List<String> prompts = Arrays.asList(
                        "Give me a 7 day learning plan",
                        "What should I learn next?",
                        "Suggest a project"
                );
                return new MentorResponse(reply, prompts);
            }
        }

        // =========================================================================
        // 6. Project Suggestions
        // =========================================================================
        if (query.contains("project") || query.contains("build")) {
            String project1 = goalTitle.contains("Data")
                    ? "Automated Financial Analytics & KPI Dashboard (Python, Pandas, SQL, PowerBI)"
                    : goalTitle.contains("AI")
                    ? "Real-Time RAG Assistant with Vector Search (Python, LangChain, FAISS, FastAPI)"
                    : goalTitle.contains("DevOps")
                    ? "GitOps CI/CD Deployment Platform with Kubernetes & Prometheus"
                    : "Distributed Multi-Tenant SaaS Engine with " + nextSkill + " (Spring Boot, Angular, MySQL, Docker)";

            String project2 = goalTitle.contains("Frontend")
                    ? "Enterprise Collaborative Kanban Dashboard (Angular, RxJS Signals, Tailwind)"
                    : "High-Throughput E-Commerce Order Microservice with Rate Limiting & JWT";

            String reply = "### 💡 Recommended Portfolio Projects for " + goalTitle + "\n\n"
                    + "To directly bridge your priority gap in **" + nextSkill + "** while leveraging your existing strengths (" + currentSkillsSummary + "), I recommend building:\n\n"
                    + "1. **" + project1 + "**\n"
                    + "   - **Target Gaps:** " + nextSkill + ", System Architecture\n"
                    + "   - **Why It Stands Out:** Demonstrates production-grade design, separation of concerns, and security.\n"
                    + "   - **Key Features:** User authentication, cached reads, structured logging, CI/CD pipeline.\n\n"
                    + "2. **" + project2 + "**\n"
                    + "   - **Target Gaps:** REST APIs, Cloud Containerization\n"
                    + "   - **Why It Stands Out:** Recruiters look for experience handling state, async operations, and responsive UIs.";

            List<String> prompts = Arrays.asList(
                    "What should I learn next?",
                    "How can I improve my resume?",
                    "Give me a 7 day learning plan"
            );
            return new MentorResponse(reply, prompts);
        }

        // =========================================================================
        // 7. Resume & ATS Optimization
        // =========================================================================
        if (query.contains("resume") || query.contains("ats") || query.contains("cv")) {
            String reply = "### 📄 Resume Optimization for " + goalTitle + " Roles\n\n"
                    + "To ensure your resume clears ATS filters and catches the engineering hiring manager's eye:\n\n"
                    + "1. **Highlight Your Verified Proficiencies:**\n"
                    + "   List: `" + currentSkillsSummary + "` prominently under Technical Skills.\n\n"
                    + "2. **Use Google's XYZ Metric Formula:**\n"
                    + "   *\"Accomplished [X] as measured by [Y], by doing [Z].\"*\n"
                    + "   - Example: *\"Designed RESTful endpoints using Spring Boot & MySQL, decreasing query latency by 35% with Redis caching.\"*\n\n"
                    + "3. **Address Your Skill Gaps strategically:**\n"
                    + "   Do not list **" + nextSkill + "** until you have built at least one working project with it. Employers verify gap skills thoroughly during technical rounds!\n\n"
                    + "4. **Include Clean GitHub / Portfolio Links:**\n"
                    + "   Ensure your repositories have concise README files, architectural diagrams, and test coverage.";

            List<String> prompts = Arrays.asList(
                    "What should I learn next?",
                    "Suggest a project for me",
                    "Prepare me for an interview"
            );
            return new MentorResponse(reply, prompts);
        }

        // =========================================================================
        // 8. Interview Preparation
        // =========================================================================
        if (query.contains("interview") || query.contains("question") || query.contains("test my") || query.contains("quiz")) {
            String reply = "### 🎙️ Technical Interview Preparation: " + goalTitle + "\n\n"
                    + "Here are 3 high-yield technical interview questions frequently asked for your target path:\n\n"
                    + "1. **Core Concept & Lifecycle:**\n"
                    + "   *How does dependency injection and inversion of control (IoC) improve modularity and testability in enterprise applications?*\n\n"
                    + "2. **Security & Authentication (Targeting " + nextSkill + "):**\n"
                    + "   *Explain the difference between authentication and authorization. How do stateless JWT tokens prevent CSRF and session hijacking?*\n\n"
                    + "3. **Database Performance & Concurrency:**\n"
                    + "   *What is the difference between optimistic and pessimistic locking, and how do database transactions enforce ACID guarantees?*\n\n"
                    + "Would you like to practice answering one of these questions, or review the recommended answers?";

            List<String> prompts = Arrays.asList(
                    "Explain authentication vs authorization",
                    "What should I learn next?",
                    "Give me a 7 day learning plan"
            );
            return new MentorResponse(reply, prompts);
        }

        // =========================================================================
        // 9. Default / General Career Mentor Greeting
        // =========================================================================
        String reply = "Hello " + studentName + "! I am your **CareerAI Personal Mentor**.\n\n"
                + "I am actively tracking your progress for **" + goalTitle + "**.\n\n"
                + "### Quick Overview:\n"
                + "- **Readiness Score:** **" + readiness + "%**\n"
                + "- **Top Priority Skill Gap:** **" + nextSkill + "**\n"
                + "- **Current Roadmap Milestone:** *" + nextMilestone + "* (" + roadmapProgress + "% complete)\n"
                + "- **Learning Streak:** " + ctx.getLearningStreak() + " days 🔥\n\n"
                + "How can I mentor you today? You can ask me what to learn next, for project ideas, a study plan, or interview prep!";

        List<String> prompts = Arrays.asList(
                "What should I learn next?",
                "Explain my skill gaps",
                "Give me a 7 day learning plan",
                "Suggest a project",
                "Am I ready for my career goal?"
        );
        return new MentorResponse(reply, prompts);
    }

    private String extractSkillFromQuery(String query, StudentCareerContext ctx) {
        for (StudentCareerContext.GapSummary gap : ctx.getSkillGaps()) {
            if (query.contains(gap.getSkillName().toLowerCase())) {
                return gap.getSkillName();
            }
        }
        for (StudentCareerContext.SkillSummary s : ctx.getSkills()) {
            if (query.contains(s.getSkillName().toLowerCase())) {
                return s.getSkillName();
            }
        }
        return ctx.getRecommendedNextSkill() != null ? ctx.getRecommendedNextSkill() : "Spring Security";
    }

    private String generateWhySkillImportant(String skill, String goal) {
        String s = skill.toLowerCase();
        if (s.contains("security")) {
            return "**" + skill + "** is critical for a " + goal + " because every production application requires reliable user authentication, password hashing, JWT authorization, and role-based permissions to protect user data.";
        } else if (s.contains("docker") || s.contains("kubernetes") || s.contains("devops")) {
            return "**" + skill + "** is vital because modern engineering teams package, ship, and deploy microservices reliably across cloud environments using standard containers.";
        } else if (s.contains("spring") || s.contains("api") || s.contains("rest")) {
            return "**" + skill + "** is the backbone of backend architecture, powering contract-driven data exchange between user interfaces and persistent databases.";
        } else if (s.contains("angular") || s.contains("react") || s.contains("frontend")) {
            return "**" + skill + "** allows you to build responsive, reactive client applications that deliver seamless user interactions.";
        } else if (s.contains("sql") || s.contains("database") || s.contains("mysql")) {
            return "**" + skill + "** ensures reliable relational persistence, schema design, and query optimization for high-concurrency systems.";
        } else {
            return "**" + skill + "** is a mandatory benchmark skill for **" + goal + "** that bridges core logic with real-world enterprise engineering standards.";
        }
    }
}
