import {
  AffiPadErrorResponse,
  AffiPadSuccessResponse,
  ConvertApiResponse,
} from './types';

const AFFIPAD_BASE_URL = 'https://api.affipad.com';
const REQUEST_TIMEOUT_MS = 12000;

export async function convertShopeeUrl(
  sanitizedUrl: string
): Promise<ConvertApiResponse> {
  const apiKey = process.env.AFFIPAD_API_KEY?.trim();
  const toolId = process.env.AFFIPAD_TOOL_ID?.trim();
  const expectedAffiliateId = process.env.EXPECTED_AFFILIATE_ID?.trim();

  // Kiểm tra cấu hình môi trường phía server
  if (!apiKey || !toolId) {
    return {
      success: false,
      error: 'Dịch vụ đang được cấu hình.',
    };
  }

  try {
    const response = await fetch(`${AFFIPAD_BASE_URL}/v1/convert`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: sanitizedUrl,
        toolId: toolId,
        useCache: true,
        useShortLink: true,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorData = data as AffiPadErrorResponse;
      const errorCode = errorData.error?.code || '';

      switch (errorCode) {
        case 'INVALID_URL':
          return { success: false, error: 'Link Shopee không hợp lệ.' };
        case 'INVALID_REQUEST':
          return { success: false, error: 'Yêu cầu không hợp lệ.' };
        case 'QUOTA_EXCEEDED':
          return { success: false, error: 'Dịch vụ tạm đạt giới hạn.' };
        case 'RATE_LIMITED':
          return { success: false, error: 'Thao tác quá nhanh. Thử lại sau.' };
        case 'SHOPEE_BLOCKED':
          return { success: false, error: 'Shopee đang tạm giới hạn yêu cầu.' };
        case 'RESOLVE_FAILED':
          return { success: false, error: 'Không thể đọc link này.' };
        case 'NO_AFFILIATES':
          return { success: false, error: 'Dịch vụ affiliate đang bận. Thử lại sau.' };
        case 'UNAUTHORIZED':
        case 'TOOL_NOT_FOUND':
          return { success: false, error: 'Dịch vụ đang được cấu hình.' };
        default:
          return { success: false, error: 'Có lỗi xảy ra. Thử lại.' };
      }
    }

    const successData = data as AffiPadSuccessResponse;
    const results = successData.data?.results;

    if (!results || results.length === 0) {
      return { success: false, error: 'Không tìm thấy link affiliate phù hợp.' };
    }

    const firstResult = results[0];

    // Xác minh Affiliate ID nếu có cấu hình
    if (expectedAffiliateId && firstResult.affiliateId !== undefined && firstResult.affiliateId !== null) {
      const returnedAffiliateId = String(firstResult.affiliateId).trim();
      if (returnedAffiliateId !== expectedAffiliateId) {
        // Affiliate ID không khớp - Chặn ngay lập tức để bảo vệ hoa hồng
        return {
          success: false,
          error: 'Lỗi cấu hình hệ thống (Affiliate ID không khớp).',
        };
      }
    }

    return {
      success: true,
      url: firstResult.link,
      shortUrl: firstResult.shortUrl || null,
      shopId: firstResult.shopId || null,
      itemId: firstResult.itemId || null,
    };
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'TimeoutError') {
      return { success: false, error: 'Kết nối quá hạn. Thử lại.' };
    }
    return { success: false, error: 'Không thể kết nối. Thử lại.' };
  }
}
