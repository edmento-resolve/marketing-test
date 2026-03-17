export interface StudentDueFeeItem {
    id: string;
    fee_item_id: string;
    title: string;
    due_date: string;
    total_amount: number;
    paid_amount: number;
    pending_amount: number;
    base_amount: number;
    convenience_fee: number;
    discount_amount: number;
    late_fee: number;
    type: string;
    status: string;
}

export interface StudentDueAmountsData {
    student_name: string;
    class_name: string;
    admission_no: string;
    total_paid: number;
    total_pending: number;
    fee_items_count: number;
    fee_items: StudentDueFeeItem[];
}

export interface StudentDueAmountsResponse {
    success: boolean;
    message: string;
    data: StudentDueAmountsData;
}

export interface RecordPaymentPayload {
    student_id: string;
    fee_installments_id: string;
    amount_paid: number;
    payment_mode: string;
    transaction_reference?: string;
    discount_fee: number;
    late_fee: number;
}

export interface RecordPaymentResponse {
    success: boolean;
    message: string;
    data: any;
}

export interface BulkPaymentPayload {
    fee_item_id: string;
    student_ids: string[];
    amount: number;
    payment_mode: string;
    transaction_reference?: string;
}

export interface GroupFeeItem {
    id: string;
    title: string;
    description: string;
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

export interface GroupFeeItemsResponse {
    success: boolean;
    message: string;
    data: GroupFeeItem[];
}
