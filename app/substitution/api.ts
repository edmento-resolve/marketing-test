export type TimetableEntry = {
    id: string;
    course_id?: string;
    class_id?: string;
    division_id?: string;
    period_no: number;
    subject: string;
    subject_id?: string;
    teacher_id?: string;
    teacher_name?: string;
    status: "present" | "leave" | "permission";
    is_substituted: boolean;
    substitution?: {
        substitute_teacher_id: string;
        substitute_teacher_name: string;
        original_teacher_id: string;
    };
};

export type TeacherApiEntry = {
    teacher_id: string;
    name: string;
    email: string;
    subjects: Array<{ subject_name: string } | string>;
};

export type SubstitutionPayload = {
    teacher_id: string;
    substitute_teacher_id: string;
    class_id: string;
    division_id: string;
    period_no: number;
    substitution_date: string;
    subject_id?: string;
    type: string;
};

export type LeavePayload = {
    teacher_id: string;
    start_date: string;
    end_date: string;
    leave_type: "full-day" | "period-wise";
    request_category: "leave" | "permission";
    periods?: number[];
};

export const fetchTimetable = async () => {
    // Mock data
    const entries: TimetableEntry[] = [
        { id: "1", period_no: 1, subject: "Math", teacher_id: "t1", teacher_name: "John Doe", status: "present", is_substituted: false },
        { id: "2", period_no: 2, subject: "Science", teacher_id: "t2", teacher_name: "Jane Smith", status: "present", is_substituted: false },
    ];
    const entries2: TimetableEntry[] = [
        { id: "3", period_no: 1, subject: "English", teacher_id: "t3", teacher_name: "Alice Johnson", status: "present", is_substituted: false },
        { id: "4", period_no: 2, subject: "Math", teacher_id: "t1", teacher_name: "John Doe", status: "present", is_substituted: false },
    ];

    type DayData = {
        class_id: string;
        division_id: string;
        class_name: string;
        date: string;
        entries: TimetableEntry[];
    };

    const todayData: DayData[] = [
        {
            class_id: "class-1",
            division_id: "div-1",
            class_name: "Class 10A",
            date: new Date().toISOString(),
            entries: entries
        },
        {
            class_id: "class-2",
            division_id: "div-2",
            class_name: "Class 9B",
            date: new Date().toISOString(),
            entries: entries2
        }
    ];

    return {
        data: {
            today: todayData,
            tomorrow: [] as DayData[]
        }
    };
};

export const fetchTeachers = async () => {
    // Mock data
    return {
        data: {
            teachers: [
                { teacher_id: "t1", name: "John Doe", email: "john@example.com", subjects: ["Math"] },
                { teacher_id: "t2", name: "Jane Smith", email: "jane@example.com", subjects: [{ subject_name: "Science" }] },
                { teacher_id: "t3", name: "Alice Johnson", email: "alice@example.com", subjects: ["English"] },
            ] as TeacherApiEntry[]
        }
    };
};

export const saveSubstitutions = async (payload: any) => {
    console.log("Saving substitutions:", payload);
    return { success: true };
};

export const fetchAISubstituteRecommendations = async (date: string) => {
    return { data: { recommendations: [] } };
};

export const markLeave = async (payload: LeavePayload) => {
    console.log("Marking leave:", payload);
    return { success: true, message: "Leave marked successfully" };
};
