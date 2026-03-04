import { AgentConfig } from '@/app/config/agentConfig';

export interface AgentResponse {
  content: string;
  suggestions?: string[];
}

type RoleResponse = {
  greeting: string;
  default: string;
  [key: string]: string;
};

// Mock AI service with role-based responses
export const mockAgentService = {
  async sendMessage(message: string, role: string, config: AgentConfig): Promise<AgentResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const lowerMessage = message.toLowerCase();

    // Role-based response templates
    const responses: Record<string, RoleResponse> = {
      coordinator: {
        greeting: "Hello! I'm here to help you with academic coordination. I can assist with year planning, team management, leave coordination, and exam planning.",
        yearPlan: "I can help you create and manage year plans. Would you like me to guide you through setting up a new year plan or reviewing an existing one?",
        team: "For team management, I can help you review team performance, suggest improvements, and coordinate team activities.",
        leave: "I can assist with leave management by reviewing pending requests, suggesting coverage plans, and ensuring proper scheduling.",
        exam: "For exam planning, I can help you schedule exams, coordinate resources, and ensure proper coverage.",
        default: "I understand you're working on coordination tasks. How can I specifically help you with your current responsibilities?"
      },
      teacher: {
        greeting: "Hi! I'm your teaching assistant. I can help you with lesson planning, classroom management, grading, and student engagement.",
        lesson: "I can help you create engaging lesson plans. What subject and grade level are you working with?",
        classroom: "For classroom management, I can suggest activities, engagement strategies, and organizational tips.",
        grading: "I can help you with grading strategies, rubric creation, and efficient assessment methods.",
        students: "I can assist with student engagement, behavior management, and learning support strategies.",
        default: "I'm here to support your teaching. What specific area would you like help with today?"
      },
      admin: {
        greeting: "Welcome! I'm your administrative assistant. I can help you with staff management, student records, class setup, and system configuration.",
        staff: "I can help you manage staff records, track performance, and handle administrative tasks.",
        students: "For student management, I can assist with enrollment, records, and data organization.",
        classes: "I can help you set up new classes, configure divisions, and manage class assignments.",
        system: "For system configuration, I can guide you through settings and help optimize your administrative processes.",
        default: "I'm here to help with administrative tasks. What specific area needs attention?"
      },
      principal: {
        greeting: "Good day! I'm your executive assistant. I can help you with strategic planning, performance oversight, decision support, and school leadership.",
        planning: "I can help you with strategic planning, goal setting, and long-term school development.",
        performance: "For performance oversight, I can help you analyze metrics, identify trends, and make data-driven decisions.",
        reports: "I can assist with generating comprehensive reports and analyzing school performance data.",
        leadership: "For leadership support, I can help with decision-making, stakeholder communication, and strategic initiatives.",
        default: "I'm here to support your leadership role. What strategic area would you like to focus on?"
      },
      parent: {
        greeting: "Hello! I'm here to help you stay informed about your child's education and school activities.",
        progress: "I can help you track your child's academic progress and understand their performance.",
        activities: "I can keep you updated on school events, activities, and important dates.",
        communication: "I can help you connect with teachers and school staff for better communication.",
        support: "I can guide you on available support resources and how to help your child succeed.",
        default: "I'm here to help you support your child's education. What information do you need?"
      },
      student: {
        greeting: "Hey there! I'm your learning assistant. I can help you with your studies, assignments, and school activities.",
        homework: "I can help you understand concepts, organize your work, and develop study strategies.",
        schedule: "I can help you manage your schedule, track assignments, and stay organized.",
        learning: "I can suggest study methods, learning resources, and academic support options.",
        activities: "I can help you find and participate in school activities and clubs.",
        default: "I'm here to help you succeed in school. What do you need assistance with?"
      }
    };

    const roleResponses = responses[role as keyof typeof responses] || responses.coordinator;

    // Check for specific keywords and provide contextual responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('help')) {
      return {
        content: roleResponses.greeting,
        suggestions: config.suggestedPrompts.slice(0, 3)
      };
    }

    if (lowerMessage.includes('year plan') || lowerMessage.includes('planning')) {
      return {
        content: roleResponses.yearPlan || roleResponses.planning || roleResponses.default,
        suggestions: ['Create new year plan', 'Review existing plan', 'Set up class schedule']
      };
    }

    if (lowerMessage.includes('team') || lowerMessage.includes('staff')) {
      return {
        content: roleResponses.team || roleResponses.staff || roleResponses.default,
        suggestions: ['View team overview', 'Review performance', 'Assign tasks']
      };
    }

    if (lowerMessage.includes('leave') || lowerMessage.includes('absence')) {
      return {
        content: roleResponses.leave || roleResponses.default,
        suggestions: ['Review leave requests', 'Plan coverage', 'Check schedule']
      };
    }

    if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
      return {
        content: roleResponses.exam || roleResponses.default,
        suggestions: ['Schedule exams', 'Plan resources', 'Review coverage']
      };
    }

    if (lowerMessage.includes('lesson') || lowerMessage.includes('class')) {
      return {
        content: roleResponses.lesson || roleResponses.classroom || roleResponses.default,
        suggestions: ['Create lesson plan', 'Plan activities', 'Organize materials']
      };
    }

    if (lowerMessage.includes('grade') || lowerMessage.includes('assessment')) {
      return {
        content: roleResponses.grading || roleResponses.default,
        suggestions: ['Grade assignments', 'Create rubrics', 'Track progress']
      };
    }

    if (lowerMessage.includes('student') || lowerMessage.includes('child')) {
      return {
        content: roleResponses.students || roleResponses.progress || roleResponses.default,
        suggestions: ['View progress', 'Check activities', 'Contact teacher']
      };
    }

    if (lowerMessage.includes('report') || lowerMessage.includes('analytics')) {
      return {
        content: roleResponses.reports || roleResponses.performance || roleResponses.default,
        suggestions: ['Generate report', 'View analytics', 'Track metrics']
      };
    }

    // Default response based on role
    return {
      content: roleResponses.default,
      suggestions: config.suggestedPrompts.slice(0, 3)
    };
  }
};

// Future: Replace with real API integration
export const agentService = mockAgentService;





















