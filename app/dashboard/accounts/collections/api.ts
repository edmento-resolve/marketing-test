import { api } from "@/lib/axios";
import { FeeTrackingResponse, FeeTrackingParams, ClassStructureResponse } from "./type";

export const fetchFeeTracking = async (params: FeeTrackingParams) => {
    // Construct query string manually to handle empty strings/undefined
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.channel && params.channel !== 'all') query.append('channel', params.channel.toUpperCase());
    if (params.fee_item_id && params.fee_item_id !== 'all') query.append('fee_item_id', params.fee_item_id);
    if (params.grade_id && params.grade_id !== 'all') query.append('grade_id', params.grade_id);
    if (params.status && params.status !== 'all') query.append('status', params.status.toUpperCase());
    if (params.from_date) query.append('from_date', params.from_date);
    if (params.to_date) query.append('to_date', params.to_date);
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());

    return api.get<FeeTrackingResponse>(`/api/v1/accounts/fee-tracking?${query.toString()}`);
};

export const fetchClassStructure = async () => {
    return api.get<ClassStructureResponse>("/api/v1/classes/structure");
};

export const fetchFeeItems = async () => {
    return api.get<any>("/api/v1/accounts/fee-items");
};
