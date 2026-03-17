import { api } from "@/lib/axios";

export interface Student {
    id: string;
    name: string;
    avatar: string | null;
    class: string;
    admission_number: string;
}

export interface StudentResponse {
    success: boolean;
    message: string;
    data: {
        students: Student[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export const searchStudents = async (
    searchTerm: string,
    page: number = 1
) => {
    return api.get<StudentResponse>(`/api/v1/auth/students`, {
        params: {
            search: searchTerm,
            page
        }
    });
};

export interface Staff {
    id: string;
    name: string;
    avatar: string | null;
    position: string;
    category: string;
}

export interface StaffResponse {
    success: boolean;
    message: string;
    data: {
        staffs: Staff[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

export const searchStaffs = async (
    searchTerm: string,
    page: number = 1
) => {
    return api.get<StaffResponse>(`/api/v1/auth/staffs`,{
        params: {
            search: searchTerm,
            page
        }
    });
};

export const createGroup = async (payload: any) => {
    return api.post("/api/v1/accounts/groups", payload);
};

export const EditGroup = async (group_id: string, payload: any) => {
    return api.put(`api/v1/accounts/groups/${group_id}/members`, payload);
};

export interface GroupMember {
    id: string;
    student_id?: string;
    staff_id?: string;
    teacher_id?: string;
    recipient_type: "student" | "staff" | "teacher";
    display_name: string;
    contact_email: string;
    admission_number?: string;
    position_name?: string;
}

export interface AccountGroup {
    id: string;
    group_name: string;
    members: GroupMember[];
    member_count: number;
}

export interface AccountGroupResponse {
    success: boolean;
    message: string;
    data: AccountGroup[];
}

export const fetchGroups = async () => {
    return api.get<AccountGroupResponse>("/api/v1/accounts/groups");
};

export interface AccountGroupDetail extends GroupSummary {
    members: GroupMember[];
}

export interface AccountGroupDetailResponse {
    success: boolean;
    message: string;
    data: AccountGroupDetail;
}

export const fetchGroupDetails = async (groupId: string) => {
    return api.get<AccountGroupDetailResponse>(`/api/v1/accounts/groups`, {
        params: { group_id: groupId }
    });
};

export interface GroupSummary {
    id: string;
    group_name: string;
    member_count: number;
    creator_details: {
        name: string;
        role: string;
        class_name: string | number;
        division_name: string;
    };
}

export interface GroupSummaryResponse {
    success: boolean;
    message: string;
    data: GroupSummary[];
}

export const getGroupsSummary = async () => {
    return api.get<GroupSummaryResponse>(`/api/v1/accounts/groups/summary`);
};



export const deleteGroup = async (id: string) => {
    return api.delete(`/api/v1/accounts/groups/${id}`);
};
