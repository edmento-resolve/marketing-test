export interface Division {
    id: string;
    division_name: string;
    student_count: number | null;
}

export interface Class {
    id: string;
    class_number: number;
    academic_year: string;
    divisions: Division[];
}

export interface Section {
    id: string;
    section_name: string;
    coordinators: any[];
    classes: Class[];
}

export interface ClassStructureResponse {
    success: boolean;
    message: string;
    data: {
        sections: Section[];
    };
}

export interface GroupMember {
    id: string;
    student_id?: string;
    teacher_id?: string;
    recipient_type: "student" | "teacher";
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
export interface FeeTarget {
    id: string;
    class_id?: string;
    division_id?: string;
    class_name?: string;
    group_id?: string;
    group_name?: string;
    section_id?: string;
    student_id?: string;
}

export interface FeeItem {
    id: string;
    school_id: string;
    title: string;
    amount: number;
    frequency: string;
    description: string;
    payment_mode: string;
    target_type: string;
    start_month: string;
    end_month: string;
    due_date: string;
    start_date: string;
    targets: FeeTarget[];
}

export interface Installment {
    installment_no: number;
    installment_name: string;
    start_date: string;
    due_date: string;
    amount: number;
}

export interface CreateFeeItemPayload {
    title: string;
    base_amount: number;
    frequency: "ONE_TIME" | "INSTALLMENT";
    description: string;
    payment_mode: "CASH" | "CASH-ONLINE";
    status?: "DRAFT" | "ACTIVE" | "PAUSED";
    start_date?: string;
    end_date?: string;
    targets: {
        target_type: "SECTION" | "GROUP" | "STUDENT" | "DIVISION";
        target_id: string;
    }[];
    discount_type?: "PERCENTAGE" | "AMOUNT";
    discount_value?: number;
    convenience_fee?: number;
    installments?: Installment[];
}

export interface FeeItemResponse {
    success: boolean;
    message: string;
    data: FeeItem[];
}
export interface StudentDue {
    fee_item_id: string;
    title: string;
    amount: number;
    total_payable: number;
    paid_amount: number;
    due_amount: number;
    frequency: string;
}

export interface StudentDueAmountsResponse {
    success: boolean;
    message: string;
    data: {
        dues: StudentDue[];
        total_due: number;
    };
}
