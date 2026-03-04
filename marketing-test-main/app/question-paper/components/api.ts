import { api } from "@/lib/axios";
import axios from "axios";
import type {
    SubjectsAPIResponse,
    QuestionPaperGenerationResponse,
    QuestionPaperR2Data,
    MarkingSchemeR2Data,
    QuestionPaperAnswersResponse,
    ClassesAPIResponse,
    BoardsAPIResponse
} from "./types";

export type {
    SubjectsAPIResponse,
    QuestionPaperGenerationResponse,
    QuestionPaperR2Data,
    MarkingSchemeR2Data,
    QuestionPaperAnswersResponse,
    ClassesAPIResponse,
    BoardsAPIResponse
};

export interface PortionPlan {
    id: string;
    class_id: string;
    subject_id: string;
    r2_key: string;
    created_at: string;
}

export interface PortionPlansResponse {
    success: boolean;
    message: string;
    data: PortionPlan[];
}

export interface Topic {
    id?: string; // Optional as not strictly in the R2 partial
    text?: string; // year plan uses text, but user sample has direct strings in topics array? 
    // Wait, user sample: "topics": ["6.1 Introduction", ...] (strings).
    // So topics is string[].
}

export interface Chapter {
    chapter_name: string;
    topics: string[];
}

export interface SyllabusData {
    chapters: Chapter[];
}

export interface QuestionTypeBlueprint {
    question_type: string;
    question_count: number;
    marks_per_question: number;
}

export interface QuestionPaperUnit {
    unit_name: string;
    topics: string[];
    blue_print: QuestionTypeBlueprint[];
}

export interface GenerateQuestionPaperPayload {
    board_id: string;
    class_id: string;
    subject_id: string;
    units: QuestionPaperUnit[];
    difficulty: {
        easy: number;
        medium: number;
        hard: number;
    };
}



export interface QuestionPaperListItem {
    id: string;
    subject_id: string;
    subject_name?: string;
    class_name: string;
    user_id: string;
    r2_key: string;
    created_at: string;
}

export interface QuestionPapersListResponse {
    status: string;
    message: string;
    data: QuestionPaperListItem[];
}

export interface RegenerateQuestionPayload {
    question_number: number;
    s3_key: string;
}

export interface MarkingSchemeItem {
    question_number: string;
    section: string;
    correct_answer: string;
    marking_points: string[];
    total_marks: number;
}

export interface RegenerateQuestionResponse {
    success: boolean;
    question: {
        question_number: string;
        question_text: string;
        marks: number;
        options: string[];
        has_diagram: boolean;
        chapter_name: string;
        topic: string;
    };
    marking_scheme: MarkingSchemeItem[];
}

export const questionPaperApi = {
    /**
     * Fetch all boards and their subjects
     */
    async fetchSubjects(board_id: string): Promise<SubjectsAPIResponse> {
        const response = await api.get<SubjectsAPIResponse>("/api/subjects", {
            params: {
                board_id: board_id,
            }
        });
        return response.data;
    },

    /**
     * Fetch all classes
     */
    async fetchClasses(): Promise<ClassesAPIResponse> {
        const response = await api.get<ClassesAPIResponse>("/api/classes");
        return response.data;
    },

    /**
     * Fetch all boards
     */
    async fetchBoards(): Promise<BoardsAPIResponse> {
        const response = await api.get<BoardsAPIResponse>("/api/boards");
        return response.data;
    },



    /**
     * Fetch portion plans (syllabus mappings)
     */
    async fetchPortionPlans(subject_id: string, class_id: string): Promise<PortionPlansResponse> {
        const response = await api.get<PortionPlansResponse>("/api/portion-plans", {
            params: {
                subject_id: subject_id,
                class_id: class_id,
            }
        });
        return response.data;
    },

    /**
     * Fetch syllabus content from R2 via proxy
     */
    async fetchSyllabus(r2Key: string): Promise<SyllabusData> {
        const response = await axios.post("/api/r2/teacherplan/get", {
            community_Url: r2Key
        });

        if (response.data.success) {
            return response.data.data;
        }
        throw new Error(response.data.message || "Failed to fetch syllabus");
    },

    /**
     * Generate question paper
     */
    async generateQuestionPaper(payload: GenerateQuestionPaperPayload): Promise<QuestionPaperGenerationResponse> {
        const response = await api.post("/api/question-paper", payload);
        const data = response.data;

        if (data.success) {

        }

        return data;
    },



    /**
     * Fetch list of generated question papers
     */
    async fetchQuestionPapers(): Promise<QuestionPapersListResponse> {
        const response = await api.get<QuestionPapersListResponse>("/api/v1/question-papers/questions");
        return response.data;
    },

    /**
     * Fetch the full Question Paper JSON from R2 via proxy
     */
    async fetchQuestionPaper(r2Key: string): Promise<QuestionPaperR2Data> {
        // The r2Key might just be "question-papers/..." so we pass it as community_Url
        const response = await axios.post("/api/r2/teacherplan/get", {
            community_Url: r2Key
        });

        if (response.data.success || response.data.id) {
            return response.data.data || response.data;
        }
        throw new Error("Failed to fetch question paper content");
    },

    /**
     * Fetch the full Marking Scheme JSON from R2 via proxy
     */
    async fetchMarkingScheme(r2Key: string): Promise<MarkingSchemeR2Data> {
        const response = await axios.post("/api/r2/teacherplan/get", {
            community_Url: r2Key
        });


        if (response.data.success || response.data.id) {
            return response.data.data || response.data;
        }
        throw new Error("Failed to fetch marking scheme content");
    },

    /**
     * Fetch answer metadata for a question paper
     */
    async fetchQuestionPaperAnswersMetadata(questionPaperId: string): Promise<QuestionPaperAnswersResponse> {
        const response = await api.get<QuestionPaperAnswersResponse>(`/api/v1/question-papers/answers/${questionPaperId}`);
        return response.data;
    },

    /**
     * Regenerate a specific question
     */
    async regenerateQuestion(payload: RegenerateQuestionPayload): Promise<RegenerateQuestionResponse> {
        const response = await api.post<RegenerateQuestionResponse>("/api/v1/ai/question-paper/regenerate-question", payload);
        return response.data;
    },

    async deleteQuestionPaper(id: string, key: string): Promise<void> {
        await api.delete(`/api/v1/question-papers/${id}`, {
            params: {
                r2_key: key
            }
        });
    },

    /**
     * Generate question paper with streaming response
     */
    async generateQuestionPaperStream(
        payload: GenerateQuestionPaperPayload,
        onLog: (text: string) => void,
        onSuccess: (data: QuestionPaperGenerationResponse) => void,
        onError: (error: any) => void
    ): Promise<void> {
        let processedIndex = 0;
        let buffer = "";

        try {
            await api.post("/api/question-paper/generate", payload, {
                onDownloadProgress: (progressEvent) => {
                    const xhr = progressEvent.event?.target as XMLHttpRequest | undefined;
                    if (!xhr) return;

                    const fullResponse = xhr.response;
                    // Ensure response is text
                    if (typeof fullResponse !== 'string') return;

                    const newChunk = fullResponse.substring(processedIndex);
                    processedIndex = fullResponse.length;

                    buffer += newChunk;

                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine || trimmedLine === ":" || trimmedLine === "stream-start") continue;

                        if (trimmedLine.startsWith("data: ")) {
                            const jsonStr = trimmedLine.slice(6);
                            if (jsonStr === "[DONE]") continue;

                            try {
                                const data = JSON.parse(jsonStr);

                                if (data.type === 'text') {
                                    onLog(data.data.text);
                                } else if (data.type === 'result') {
                                    // Construct the response object matching the expected interface
                                    const resultData = data.data;
                                    const successResponse: QuestionPaperGenerationResponse = {
                                        success: true,
                                        message: "Generated Successfully",
                                        question_paper_id: resultData.question_paper_id,
                                        marking_scheme_id: resultData.marking_scheme_id || "",
                                        question_paper_r2_key: resultData.question_paper_r2_key,
                                        marking_scheme_r2_key: resultData.marking_scheme_r2_key,
                                        token_usage: {
                                            tokens_used: resultData.token_usage?.total_tokens || 0,
                                            remaining: 0,
                                            limit: 0
                                        }
                                    };
                                    onSuccess(successResponse);
                                }
                            } catch (e) {
                                console.warn("Failed to parse stream data:", jsonStr);
                            }
                        }
                    }
                }
            });
        } catch (error) {
            onError(error);
        }
    }
};
