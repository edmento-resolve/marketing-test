import { api } from "@/lib/axios";
import { FeeItemResponse, FeeItemDetailResponse } from "./type";

export const fetchFeeItems = async () => {
    return api.get<FeeItemResponse>("/api/v1/accounts/fee-items");
};

export const fetchFeeItemDetail = async (id: string) => {
    return api.get<FeeItemDetailResponse>(`/api/v1/accounts/fee-items/${id}`);
};
