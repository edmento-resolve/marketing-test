
import { api } from "@/lib/axios";

export interface TeacherSubject {
    subject_id: string;
    subject_name: string;
    subject_uuid: string;
    board_type: string;
}

export interface TeacherApiEntry {
    relation_id: string;
    teacher_id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
    subjects: TeacherSubject[];
}

export interface TeachersResponse {
    success?: boolean;
    message: string;
    data: {
        teachers: TeacherApiEntry[];
        total_teachers: number;
    };
}

export interface LeavePayload {
    teacher_id: string;
    start_date: string;
    end_date: string;
    request_category: "permission" | "leave";
    leave_type: "full-day" | "period-wise";
    periods?: number[];
}

export const fetchTeachers = async () => {
    // Principal might use the same teacher endpoint or a specific one.
    // Using the coordinator one as requested/referenced for now.
    const response = await api.get<TeachersResponse>(
        "/api/v1/coordinators/team-teachers"
    );
    return response.data;
};

export const markLeave = async (payload: LeavePayload) => {
    const response = await api.post("/api/v1/leaves/mark-leaves", payload);
    return response.data;
};
