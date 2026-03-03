// agentConfig.ts
export interface AgentCapability {
  title: string;
  description: string;
  prompt: string;
}

export interface AgentConfig {
  role: string;
  welcomeMessage: string;
  capabilities: AgentCapability[];
  suggestedPrompts: string[];
  context: string;
}

export const agentConfigs: Record<string, AgentConfig> = {
  coordinator: {
    role: "Academic Coordinator Assistant",
    welcomeMessage: "Hello! I'm your AI assistant for academic coordination. I can help you with year planning, team management, leave coordination, and exam planning. What would you like assistance with?",
    capabilities: [
      {
        title: "Year Plan Management",
        description: "Help create and manage academic year plans",
        prompt: "Help me create a year plan for Class 10 with 40 periods per week"
      },
      {
        title: "Team Coordination",
        description: "Assist with team management and coordination",
        prompt: "Show me my team overview and suggest improvements"
      },
      {
        title: "Leave Management",
        description: "Help manage staff leave requests and scheduling",
        prompt: "Review pending leave requests and suggest coverage"
      },
      {
        title: "Exam Planning",
        description: "Assist with exam scheduling and coordination",
        prompt: "Help me plan the mid-term exam schedule"
      }
    ],
    suggestedPrompts: [
      "How do I create a new year plan?",
      "Show me team performance metrics",
      "Help me schedule exams for next month",
      "What are the pending leave requests?",
      "How can I improve team coordination?"
    ],
    context: "Academic coordinator responsible for year planning, team management, leave coordination, and exam planning."
  },

  teacher: {
    role: "Teaching Assistant",
    welcomeMessage: "Hi! I'm here to help you with classroom management, lesson planning, grading, and student engagement. How can I assist you today?",
    capabilities: [
      {
        title: "Lesson Planning",
        description: "Help create and organize lesson plans",
        prompt: "Create a lesson plan for Mathematics Class 10"
      },
      {
        title: "Classroom Management",
        description: "Assist with classroom activities and management",
        prompt: "Suggest classroom activities for today's lesson"
      },
      {
        title: "Assessment & Grading",
        description: "Help with grading and assessment strategies",
        prompt: "Help me grade these assignments efficiently"
      },
      {
        title: "Student Engagement",
        description: "Suggest ways to improve student engagement",
        prompt: "How can I make my lessons more engaging?"
      }
    ],
    suggestedPrompts: [
      "Help me plan today's lesson",
      "Suggest classroom activities",
      "How do I grade assignments efficiently?",
      "What are some engagement strategies?",
      "Help me organize my teaching materials"
    ],
    context: "Teacher focused on classroom management, lesson planning, student assessment, and educational delivery."
  },

  admin: {
    role: "Administrative Assistant",
    welcomeMessage: "Welcome! I'm your administrative assistant. I can help you with staff management, student records, class setup, and system configuration. What do you need help with?",
    capabilities: [
      {
        title: "Staff Management",
        description: "Help manage staff records and assignments",
        prompt: "Show me staff performance and attendance records"
      },
      {
        title: "Student Records",
        description: "Assist with student data management",
        prompt: "Help me organize student enrollment data"
      },
      {
        title: "Class Setup",
        description: "Help configure classes and divisions",
        prompt: "Guide me through setting up new classes"
      },
      {
        title: "System Configuration",
        description: "Assist with system settings and configuration",
        prompt: "Help me configure system settings"
      }
    ],
    suggestedPrompts: [
      "Show me staff overview",
      "Help me add new students",
      "Configure new classes",
      "Review system settings",
      "Generate administrative reports"
    ],
    context: "Administrator responsible for staff management, student records, class configuration, and system administration."
  },

  principal: {
    role: "Principal's Assistant",
    welcomeMessage: "Good day! I'm your executive assistant for school leadership. I can help you with oversight, decision support, reports, and strategic planning. How may I assist you?",
    capabilities: [
      {
        title: "Strategic Planning",
        description: "Help with school strategy and planning",
        prompt: "Help me plan for the next academic year"
      },
      {
        title: "Performance Oversight",
        description: "Assist with monitoring school performance",
        prompt: "Show me school performance metrics"
      },
      {
        title: "Decision Support",
        description: "Provide data-driven decision support",
        prompt: "Help me analyze enrollment trends"
      },
      {
        title: "Reports & Analytics",
        description: "Generate and analyze school reports",
        prompt: "Create a comprehensive school report"
      }
    ],
    suggestedPrompts: [
      "Show me school performance overview",
      "Help me plan school improvements",
      "Analyze enrollment trends",
      "Generate executive reports",
      "What are the key metrics to track?"
    ],
    context: "Principal focused on school leadership, strategic planning, performance oversight, and executive decision-making."
  },

  parent: {
    role: "Parent Support Assistant",
    welcomeMessage: "Hello! I'm here to help you stay informed about your child's progress and school activities. What would you like to know?",
    capabilities: [
      {
        title: "Child Progress",
        description: "Track your child's academic progress",
        prompt: "Show me my child's recent performance"
      },
      {
        title: "School Activities",
        description: "Stay updated on school events and activities",
        prompt: "What activities are happening this week?"
      },
      {
        title: "Communication",
        description: "Help with school communication and updates",
        prompt: "How can I contact my child's teacher?"
      }
    ],
    suggestedPrompts: [
      "How is my child performing?",
      "What activities are coming up?",
      "How do I contact teachers?",
      "Show me school calendar",
      "What support is available?"
    ],
    context: "Parent seeking information about child's education, school activities, and communication with school."
  },

  student: {
    role: "Student Assistant",
    welcomeMessage: "Hey there! I'm your learning assistant. I can help you with your studies, assignments, and school activities. What do you need help with?",
    capabilities: [
      {
        title: "Study Help",
        description: "Get assistance with your studies",
        prompt: "Help me understand this math concept"
      },
      {
        title: "Assignment Support",
        description: "Help with homework and assignments",
        prompt: "How do I approach this assignment?"
      },
      {
        title: "Schedule Management",
        description: "Help organize your school schedule",
        prompt: "Show me my class schedule"
      }
    ],
    suggestedPrompts: [
      "Help me with my homework",
      "Show me my schedule",
      "What assignments are due?",
      "How can I study better?",
      "What activities can I join?"
    ],
    context: "Student seeking academic support, assignment help, and school activity information."
  }
};

export const getAgentConfig = (role: string): AgentConfig => {
  return agentConfigs[role] || agentConfigs.coordinator;
};





















