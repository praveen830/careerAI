package com.careerai.dto.career;

public enum CareerGoalType {
    JAVA_FULL_STACK_DEVELOPER("Java Full Stack Developer", "Design and build end-to-end enterprise web applications using modern Java, Spring Boot, Angular, and cloud databases."),
    FRONTEND_DEVELOPER("Frontend Developer", "Craft responsive, intuitive user interfaces and accessible web experiences using modern TypeScript, Angular, and CSS architecture."),
    DATA_ANALYST("Data Analyst", "Extract business insights from complex data sets using statistical analysis, SQL querying, and interactive dashboards."),
    AI_ML_ENGINEER("AI/ML Engineer", "Build predictive machine learning models, neural networks, vector databases, and LLM-powered applications."),
    DEVOPS_ENGINEER("DevOps Engineer", "Architect scalable cloud infrastructure, automated CI/CD pipelines, Docker containers, and Kubernetes clusters.");

    private final String displayName;
    private final String defaultDescription;

    CareerGoalType(String displayName, String defaultDescription) {
        this.displayName = displayName;
        this.defaultDescription = defaultDescription;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getDefaultDescription() {
        return defaultDescription;
    }

    public static CareerGoalType fromString(String text) {
        if (text == null || text.isBlank()) {
            return JAVA_FULL_STACK_DEVELOPER;
        }
        String clean = text.trim();
        for (CareerGoalType type : values()) {
            if (type.name().equalsIgnoreCase(clean) || type.displayName.equalsIgnoreCase(clean)) {
                return type;
            }
        }
        // Partial matches
        String lower = clean.toLowerCase();
        if (lower.contains("java") || lower.contains("spring")) return JAVA_FULL_STACK_DEVELOPER;
        if (lower.contains("frontend") || lower.contains("angular") || lower.contains("react")) return FRONTEND_DEVELOPER;
        if (lower.contains("data") && lower.contains("analy")) return DATA_ANALYST;
        if (lower.contains("ai") || lower.contains("ml") || lower.contains("machine")) return AI_ML_ENGINEER;
        if (lower.contains("devops") || lower.contains("cloud")) return DEVOPS_ENGINEER;

        return JAVA_FULL_STACK_DEVELOPER;
    }
}
