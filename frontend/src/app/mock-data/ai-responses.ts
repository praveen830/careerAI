/**
 * mock-data/ai-responses.ts
 * Keyword-matched AI responses for the chat assistant.
 * Replace with real AI API call (Spring Boot → AI Service) when backend is ready.
 */

export interface AiResponseRule {
  keywords: string[];
  response: string;
  suggestedPrompts?: string[];
}

export const AI_RESPONSE_RULES: AiResponseRule[] = [
  {
    keywords: ['learn next', 'what to learn', 'focus', 'recommend', 'suggestion'],
    response: `Based on your current skill profile and **Java Full Stack Developer** goal, I recommend focusing on **Spring Security** next.

Here's why:
• You have a **45% skill gap** in Spring Security — your largest gap
• Spring Security is required for 90%+ of Java backend roles
• Estimated learning time: **2–3 weeks** at 2 hours/day

**Suggested learning plan:**
1. Spring Security fundamentals (Week 1)
2. JWT integration with Spring Boot (Week 2)
3. Build a secured REST API project (Week 3)

After Spring Security, move to **Docker** to complete your DevOps basics.`,
    suggestedPrompts: ['Show me a Spring Security project', 'What after Spring Security?', 'Am I job-ready?'],
  },
  {
    keywords: ['job ready', 'job-ready', 'ready for job', 'interview ready', 'placement ready'],
    response: `Your current **Career Readiness Score is 68%** for Java Full Stack Developer roles.

**What this means:**
✅ You're ready for junior-level internships
⚠️ Need 15–20% more progress for full-time roles

**Your strengths:**
• Java: 75% (Strong)
• MySQL: 70% (Good)
• HTML/CSS: 80% (Excellent)

**Critical gaps holding you back:**
• Spring Security: 30% (Need 75%)
• Docker: 20% (Need 65%)
• REST API: 50% (Need 80%)

**Timeline:** Focus 2 hours/day → job-ready in **8–10 weeks**.`,
    suggestedPrompts: ['What to learn next?', 'How to improve my resume?', 'Suggest a project for me'],
  },
  {
    keywords: ['project', 'build', 'practice', 'hands-on', 'portfolio'],
    response: `Great idea! Here are the top **3 projects** I recommend based on your skill gaps:

**1. 🏆 Student Management System** (Priority #1)
• Technologies: Java, Spring Boot, MySQL, REST API
• Duration: 2–3 weeks
• Impact: Closes Spring Boot + REST API gaps
• Difficulty: Intermediate

**2. 🔐 Secure Task Manager**
• Technologies: Spring Security, JWT, Angular, MySQL
• Duration: 3–4 weeks
• Impact: Addresses Spring Security gap
• Difficulty: Intermediate-Advanced

**3. 🛒 E-Commerce Platform**
• Technologies: Angular, Spring Boot, MySQL, Docker
• Duration: 4–6 weeks
• Impact: Full-stack + Docker experience
• Difficulty: Advanced

Start with Project #1 — it directly targets your biggest current gaps.`,
    suggestedPrompts: ['Tell me more about Student Management System', 'What skills will I gain?', 'Add to my roadmap'],
  },
  {
    keywords: ['resume', 'cv', 'curriculum vitae', 'resume tips', 'improve resume'],
    response: `Based on your profile analysis, here are **personalized resume improvement tips**:

**✅ What's good:**
• Your Java and MySQL projects are strong additions
• 3 completed projects is solid for a 3rd-year student

**⚠️ What needs improvement:**
1. **Add measurable achievements** — e.g., "Reduced query time by 40%"
2. **Missing skills section keywords:** Docker, Spring Security, Kubernetes
3. **Add certifications** — Oracle Java SE or AWS Cloud Practitioner
4. **GitHub links** — Include links to your top 2 projects
5. **Quantify your projects** — Mention number of features, users, or technologies

**Resume score estimate: 78/100**

Want me to suggest specific resume sections to add?`,
    suggestedPrompts: ['What certifications should I get?', 'Help me with LinkedIn profile', 'What skills to add to resume?'],
  },
  {
    keywords: ['skill gap', 'gaps', 'missing skills', 'weak skills', 'what am i missing'],
    response: `Here's your complete **Skill Gap Report** for Java Full Stack Developer:

**🔴 Critical Gaps (Priority 1):**
| Skill | Current | Required | Gap |
|---|---|---|---|
| Spring Security | 30% | 75% | -45% |
| Docker | 20% | 65% | -45% |

**🟡 Moderate Gaps (Priority 2):**
| Skill | Current | Required | Gap |
|---|---|---|---|
| Spring Boot | 45% | 80% | -35% |
| REST API | 50% | 80% | -30% |

**🟢 Strong Skills (Keep maintaining):**
• Java: 75% ✓
• MySQL: 70% ✓
• HTML/CSS: 80% ✓
• Git: 65% ✓

**Recommended learning order:**
Spring Security → REST API → Docker → Spring Boot microservices`,
    suggestedPrompts: ['What should I learn next?', 'How long to close all gaps?', 'Show me learning resources'],
  },
  {
    keywords: ['interview', 'interview prep', 'questions', 'prepare', 'mock interview'],
    response: `Here are **top Java Full Stack interview questions** to prepare for:

**Java Core (Frequently Asked):**
• What is the difference between JDK, JRE, and JVM?
• Explain OOP concepts with examples
• What are Java Collections? When to use List vs Set vs Map?
• Explain multithreading and synchronization

**Spring Boot (Most Important for Roles):**
• What is Spring Boot auto-configuration?
• How does Dependency Injection work in Spring?
• Explain REST vs SOAP
• How do you handle exceptions in Spring Boot?
• What is Spring Security and how does JWT work?

**Database:**
• Write a JOIN query for 3 tables
• What are indexes? When to use them?
• Explain ACID properties

**Angular:**
• What is two-way data binding?
• Difference between Observable and Promise?

**Pro tip:** Practice on LeetCode (Easy/Medium), focus on Arrays, Strings, and HashMaps for DSA rounds.`,
    suggestedPrompts: ['More Spring Boot questions', 'DSA practice tips', 'How to crack HR round?'],
  },
  {
    keywords: ['roadmap', 'learning path', 'plan', 'schedule', 'timeline'],
    response: `Here's your **personalized 10-week roadmap** for Java Full Stack Developer:

**Week 1–2: Java Mastery**
• Collections, Streams, Lambda, Exception Handling
• Practice: 20 coding problems

**Week 3–4: Spring Boot Core**
• REST APIs, JPA/Hibernate, MySQL connection
• Project: Student Management CRUD API

**Week 5–6: Spring Security + JWT**
• Authentication, Authorization, JWT tokens
• Project: Add secure login to your API

**Week 7–8: Angular Frontend**
• Components, Services, HTTP Client, Routing
• Project: Connect Angular to your Spring Boot API

**Week 9: Docker + Deployment**
• Dockerize your app
• Deploy to AWS EC2 (free tier)

**Week 10: Portfolio + Interview Prep**
• Polish GitHub projects
• Record project demo videos
• Mock interviews

**Current progress: 42% complete** 🚀`,
    suggestedPrompts: ['Mark Week 2 complete', 'Resources for Spring Boot', 'What is next in my roadmap?'],
  },
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'how are you'],
    response: `Hi Praveen! 👋 Welcome back to CareerAI.

I'm your AI career mentor, and I'm here to help you become a **Java Full Stack Developer**.

Your current status:
• 🎯 Career Readiness: **68%**
• 📚 Active focus: Spring Security
• 🔥 Learning streak: **7 days** — keep it up!

**What would you like to work on today?**`,
    suggestedPrompts: ['What should I learn next?', 'Show my skill gaps', 'Suggest a project'],
  },
];

export const AI_DEFAULT_RESPONSE = `That's a great question! Based on your **Java Full Stack Developer** profile, here's what I can tell you:

Your current readiness score is **68%**, and your top focus areas should be:
1. **Spring Security** — biggest skill gap (45%)
2. **Docker** — critical for modern Java roles (45% gap)
3. **REST APIs** — frequently tested in interviews (30% gap)

Would you like me to elaborate on any of these areas, suggest a project, or help you with interview preparation?`;
