/**
 * Validation rules and Anti-SSRF protection for Shopee URLs.
 */

const ALLOWED_SHOPEE_DOMAINS = new Set([
  'shopee.vn',
  'www.shopee.vn',
  's.shopee.vn',
  'shp.ee',
  'vn.shp.ee',
  'my.shopee.vn',
]);

const PRIVATE_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^169\.254\./,
  /^0\./,
  /^localhost$/i,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

export interface ValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export function validateShopeeUrl(rawUrl: unknown): ValidationResult {
  if (typeof rawUrl !== 'string') {
    return { isValid: false, error: 'Link Shopee không hợp lệ' };
  }

  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return { isValid: false, error: 'Vui lòng nhập link Shopee' };
  }

  if (trimmed.length > 2048) {
    return { isValid: false, error: 'Link Shopee quá dài' };
  }

  // Chặn scheme nguy hiểm trực tiếp trước khi parse
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('file:') ||
    lower.startsWith('vbscript:')
  ) {
    return { isValid: false, error: 'Link Shopee không hợp lệ' };
  }

  let parsed: URL;
  try {
    // Tự động bổ sung https:// nếu người dùng dán link dạng shopee.vn/... hoặc s.shopee.vn/...
    const candidate = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

    parsed = new URL(candidate);
  } catch {
    return { isValid: false, error: 'Link Shopee không hợp lệ' };
  }

  // Chỉ chấp nhận http hoặc https
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { isValid: false, error: 'Giao thức link không được hỗ trợ' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Chống SSRF: Không cho phép IP nội bộ, loopback, localhost
  if (PRIVATE_IP_PATTERNS.some((pattern) => pattern.test(hostname))) {
    return { isValid: false, error: 'Link Shopee không hợp lệ' };
  }

  // Kiểm tra domain Shopee
  const isExactAllowed = ALLOWED_SHOPEE_DOMAINS.has(hostname);
  const isShopeeSubdomain =
    hostname.endsWith('.shopee.vn') && !hostname.includes('..');

  if (!isExactAllowed && !isShopeeSubdomain) {
    return { isValid: false, error: 'Chỉ chấp nhận link sản phẩm hoặc shop Shopee' };
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
  };
}
