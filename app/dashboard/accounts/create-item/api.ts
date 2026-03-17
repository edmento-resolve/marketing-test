import { api } from "@/lib/axios";
import { ClassStructureResponse, AccountGroupResponse, FeeItemResponse, StudentDueAmountsResponse, CreateFeeItemPayload } from "./type";

export * from "./type";

export const fetchClassStructure = async () => {
    return api.get<ClassStructureResponse>("/api/v1/classes/structure");
};

export const fetchGroups = async () => {
    return api.get<AccountGroupResponse>("/api/v1/accounts/groups");
};

export const createFeeItem = async (payload: CreateFeeItemPayload) => {
    return api.post("/api/v1/accounts/fee-items", payload);
};

export const fetchFeeItems = async () => {
    return api.get<FeeItemResponse>("/api/v1/accounts/fee-items");
};

export const fetchStudentDues = async (studentId: string) => {
    return api.get<StudentDueAmountsResponse>(`/api/v1/accounts/student-due-amounts?student_id=${studentId}`);
};

