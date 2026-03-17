import { api } from "@/lib/axios";
import { StudentDueAmountsResponse, RecordPaymentPayload, RecordPaymentResponse, GroupFeeItemsResponse } from "./type";

export const fetchStudentDueAmounts = async (studentId: string) => {
    return api.get<StudentDueAmountsResponse>(`/api/v1/accounts/student-due-amounts?student_id=${studentId}`);
};

export const recordPayment = async (payload: RecordPaymentPayload) => {
    return api.post<RecordPaymentResponse>("/api/v1/accounts/student-fee-payments", payload);
};

export const fetchGroupFeeItems = async (groupId: string) => {
    return api.get<GroupFeeItemsResponse>(`/api/v1/accounts/fee-items/group/${groupId}`);
};

export const recordBulkPayment = async (payload: any) => {
    return api.post("/api/v1/accounts/student-fee-payments/bulk", payload);
};
