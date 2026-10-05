import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { validateShopeeUrl } from '@/lib/validation';
import { convertShopeeUrl } from '@/lib/affipad';

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Trích xuất Client IP an toàn
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = (forwardedFor?.split(',')[0] || realIp || '127.0.0.1').trim();

    // 2. Kiểm tra Rate Limit (10 req/IP/phút)
    const rateLimit = checkRateLimit(clientIp);
    if (!rateLimit.isAllowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Thao tác quá nhanh. Thử lại sau.',
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.retryAfterSeconds),
          },
        }
      );
    }

    // 3. Đọc và parse request body
    let body: { url?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: 'Dữ liệu yêu cầu không hợp lệ.',
        },
        { status: 400 }
      );
    }

    // 4. Validate URL & Chống SSRF
    const validation = validateShopeeUrl(body?.url);
    if (!validation.isValid || !validation.sanitizedUrl) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error || 'Link Shopee không hợp lệ.',
        },
        { status: 400 }
      );
    }

    // 5. Chuyển đổi qua AffiPad API & xác minh Affiliate ID
    const result = await convertShopeeUrl(validation.sanitizedUrl);

    const duration = Date.now() - startTime;
    // Log an toàn (chỉ thời gian xử lý và trạng thái thành công/thất bại)
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[API /convert] Status: ${result.success ? 200 : 400} (${duration}ms)`);
    }

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: 'Có lỗi xảy ra. Thử lại.',
      },
      { status: 500 }
    );
  }
}
