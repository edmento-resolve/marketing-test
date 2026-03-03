import { api } from "@/lib/axios";

export type TimetableEntry = {
    id: string;
    period_no: number;
    subject: string;
    subject_id: string;
    teacher_id: string | null;
    teacher_name: string;
    status: "present" | "leave" | "permission";
    is_substituted: boolean;
    substitution: {
        subject: string | null;
        type: string | null;
        substitute_teacher_id: string | null;
        substitute_teacher_name: string | null;
    };
};

export type DayData = {
    date: string;
    class_id: string;
    division_id: string;
    class_name: string;
    entries: TimetableEntry[];
};

export type TeacherApiEntry = {
    id: string;
    full_name: string;
    email: string;
    position_name: string;
    subjects: {
        subject_id: string;
        subject_name: string;
    }[];
};

export type SubstitutionPayload = {
    teacher_id: string;
    substitute_teacher_id: string;
    class_id: string;
    division_id: string;
    period_no: number;
    substitution_date: string;
    subject_id: string;
    type: string;
};

export type LeavePayload = {
    from_id: string;
    start_date: string;
    end_date: string;
};

export const fetchTimetable = async () => {
    const response = await api.get<{
        success: boolean;
        message: string;
        data: {
            today: DayData[];
            tomorrow: DayData[];
        }
    }>("/api/timetable/today");

    return response.data;
};

export const fetchTeachers = async () => {
    const response = await api.get<{
        success: boolean;
        message: string;
        data: TeacherApiEntry[];
    }>("/api/users");

    // Filter for Teachers if necessary, or just return all and filter in UI
    return response.data;
};

export const saveSubstitutions = async (payload: SubstitutionPayload[]) => {
    // Send substitutions sequentially or in parallel to avoid "Cannot coerce..." error if backend expects single object
    const promises = payload.map(sub => api.post("/api/substitution", sub));
    const responses = await Promise.all(promises);
    return responses.map(r => r.data);
};

export const fetchAISubstituteRecommendations = async (date: string, onUpdate?: (text: string) => void) => {
    const response = await api.get(`/api/substitution/generation?date=${date}`, {
        responseType: 'text',
        onDownloadProgress: (progressEvent) => {
            const chunk = progressEvent.event.target.response;
            const lines = chunk.split("\n");

            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    try {
                        const jsonStr = line.replace("data: ", "").trim();
                        if (jsonStr === "{}") continue;
                        const parsed = JSON.parse(jsonStr);

                        if (parsed.type === "text" && onUpdate) {
                            onUpdate(parsed.data.text);
                        }
                    } catch (e) {
                        // Ignore partial JSON
                    }
                }
            }
        },
    });

    // The final result is usually sent as a 'result' type in the stream.
    // Axios response.data might contain the whole stream text.
    // We need to extract the final result object.
    const chunk = response.data;
    const lines = chunk.split("\n");
    for (const line of lines) {
        if (line.startsWith("data: ")) {
            try {
                const jsonStr = line.replace("data: ", "").trim();
                const parsed = JSON.parse(jsonStr);
                if (parsed.type === "result") {
                    return { data: parsed.data };
                }
            } catch (e) {
                // Ignore
            }
        }
    }

    return response.data;
};

export const markLeave = async (payload: LeavePayload) => {


    const response = await api.post("/api/leaves", payload);
    return response.data;
};
