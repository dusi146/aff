export interface ConvertRequestBody {
  url: string;
}

export interface ConvertSuccessResponse {
  success: true;
  url: string;
  shortUrl: string | null;
  shopId?: string | null;
  itemId?: string | null;
}

export interface ConvertErrorResponse {
  success: false;
  error: string;
}

export type ConvertApiResponse = ConvertSuccessResponse | ConvertErrorResponse;

export interface AffiPadResultItem {
  groupName?: string;
  link: string;
  shortUrl?: string;
  affiliateId?: string | number;
  shopId?: string;
  itemId?: string;
}

export interface AffiPadSuccessResponse {
  success: true;
  data: {
    results: AffiPadResultItem[];
    cached?: boolean;
    productInfo?: unknown;
  };
}

export interface AffiPadErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export interface RecentHistoryItem {
  id: string;
  originalUrl: string;
  affiliateUrl: string;
  displayUrl: string;
  timestamp: number;
}
