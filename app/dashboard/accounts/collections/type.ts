export interface FeeTrackingDetail {
    id: string;
    student_id: string;
    student_name: string;
    grade_name: string;
    total_due: number;
    payment_method: "CASH" | "ONLINE" | "UNPAID";
    amount_paid: number;
    date: string | null;
    status: "PENDING" | "PAID" | "PARTIAL";
}

export interface FeeTrackingResponse {
    success: boolean;
    message: string;
    data: FeeTrackingDetail[];
    pagination?: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}

export interface FeeTrackingParams {
    search?: string;
    channel?: string;
    fee_item_id?: string;
    grade_id?: string;
    status?: string;
    from_date?: string;
    to_date?: string;
    page?: number;
    limit?: number;
}

// Reuse or local define for Class Structure
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
