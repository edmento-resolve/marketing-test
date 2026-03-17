export interface FeeItem {
    fee_item_id: string;
    title: string;
    description: string | null;
    base_amount: number;
    frequency: string;
    payment_mode: string;
    status: string;
    audience_count: number;
    total_amount: number;
    collected_amount: number;
    pending_amount: number;
    due_date: string;
    days_left: number;
}

export interface FeeItemResponse {
    success: boolean;
    message: string;
    data: FeeItem[];
}

export interface FeeItemCollection {
    id: string;
    student_name: string;
    admission_number: string;
    class_name: string;
    amount: number;
    status: string;
    paid_date: string | null;
}

export interface FeeItemDetail extends FeeItem {
    collections: FeeItemCollection[];
}

export interface FeeItemDetailResponse {
    success: boolean;
    message: string;
    data: FeeItemDetail;
}
