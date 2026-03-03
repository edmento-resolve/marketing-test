export interface Subject {
    id: string;
    subject_name: string;
}

export interface Class {
    id: string;
    class_number: string;
}

export interface ClassesAPIResponse {
    success: boolean;
    message: string;
    data: Class[];
}

export interface Board {
    id: string;
    board_name: string;
}

export interface BoardsAPIResponse {
    success: boolean;
    message: string;
    data: Board[];
}

export interface BoardData {
    board_type: string;
    subjects: Subject[];
}

export interface SubjectsAPIResponse {
    success: boolean;
    message: string;
    data: Subject[];
}

export interface BasicDetails {
    board_id: string;
    class: string;
    subject_id: string;
    subject_name: string;
    examDuration: string;
}

export interface DifficultyLevel {
    easy: number;
    medium: number;
    hard: number;
}

// --- Question Paper Generation Responses ---

export interface QuestionPaperGenerationResponse {
    success: boolean;
    message: string;
    question_paper_id: string;
    marking_scheme_id: string;
    question_paper_r2_key: string;
    marking_scheme_r2_key: string;
    token_usage: {
        tokens_used: number;
        remaining: number;
        limit: number;
    };
}

// --- R2 Data Structures ---

export interface Question {
    question_number: string;
    question_text: string;
    marks: number;
    options?: string[]; // For MCQs
    has_diagram: boolean;
}

export interface QuestionSection {
    section_id: string;
    section_marks: number;
    questions: Question[];
}

export interface QuestionPaperMetadata {
    board: string;
    grade: string;
    subject_name: string;
    units: string[];
    token_usage: {
        total_tokens: number;
        prompt_tokens: number;
        completion_tokens: number;
    };
    generated_at: number;
}

export interface QuestionPaperR2Data {
    id: string;
    board: string;
    grade: string;
    subject_id: string;
    question_paper: {
        id: string;
        general_instructions: string[];
        sections: QuestionSection[];
        metadata: QuestionPaperMetadata;
    };
    created_at: string;
}

export interface MarkingPoint {
    question_number: string;
    section: string;
    correct_answer?: string; // For MCQs
    marking_points: string[];
    total_marks: number;
}

export interface MarkingSchemeR2Data {
    id: string;
    question_paper_id: string;
    marking_scheme: MarkingPoint[];
    created_at: string;
}

export interface GeneratedQuestionPaper {
    id: string;
    subject_id: string;
    class: string;
    user_id: string;
    r2_key: string;
    created_at: string;
}

export interface FetchQuestionPapersResponse {
    status: string;
    message: string;
    data: GeneratedQuestionPaper[];
}

export interface GeneratedQuestionPaper {
    id: string;
    subject_id: string;
    class: string;
    user_id: string;
    r2_key: string;
    created_at: string;
}

export interface FetchQuestionPapersResponse {
    status: string;
    message: string;
    data: GeneratedQuestionPaper[];
}

export interface QuestionPaperAnswerMetadata {
    id: string;
    question_id: string;
    r2_key: string;
    created_at: string;
}

export interface QuestionPaperAnswersResponse {
    status: string;
    message: string;
    data: QuestionPaperAnswerMetadata[];
}
