# duvansi — Shopee Link Converter

Website chuyển đổi liên kết sản phẩm Shopee thông thường thành link Shopee Affiliate cá nhân thông qua **AffiPad API**.

Được thiết kế tối giản, bảo mật, tối ưu tuyệt đối cho mobile ("Paste → Convert → Copy").

---

## 🚀 Tính năng chính

- **Chuyển đổi tức thì:** Nhận link gốc Shopee hoặc link rút gọn (`s.shopee.vn`, `shp.ee`), tạo link affiliate trong tích tắc.
- **Bảo mật tuyệt đối (Zero Leak):** Toàn bộ API Key, Tool ID và Affiliate ID được xử lý 100% tại Next.js Server Route, không bao giờ lộ ra frontend hay client bundle.
- **Xác minh hoa hồng (`EXPECTED_AFFILIATE_ID`):** Tự động đối chiếu Affiliate ID trả về từ AffiPad với ID cấu hình. Nếu không khớp sẽ lập tức chặn link để tránh thất thoát hoa hồng.
- **Bảo vệ Anti-SSRF:** Phân tích cú pháp URL nghiêm ngặt, chặn mọi giao thức độc hại (`javascript:`, `data:`, `file:`) và IP nội bộ (`localhost`, `127.0.0.1`, RFC 1918).
- **Chống spam quota:** Tích hợp rate limiting (10 lượt convert / IP / phút).
- **Giao diện Minimalist & Mobile-First:** Phong cách dark neutral sang trọng, hiệu ứng animated mesh gradient chạy trên GPU, chuyển động mượt mà với Framer Motion.
- **Lịch sử cục bộ:** Tự động lưu 3–5 link gần nhất vào `localStorage` của trình duyệt.

---

## 🛠️ Cài đặt & Khởi chạy

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Thiết lập biến môi trường

Sao chép file mẫu:

```bash
cp .env.example .env.local
```

Mở `.env.local` và điền thông tin:

```env
AFFIPAD_API_KEY=your_affipad_api_key
AFFIPAD_TOOL_ID=your_tool_id
EXPECTED_AFFILIATE_ID=17371590371
```

> ⚠️ **LƯU Ý QUAN TRỌNG:** Tuyệt đối **KHÔNG** commit file `.env.local` lên GitHub hoặc chia sẻ công khai.

### 3. Chạy ở môi trường Development

```bash
npm run dev
```

Mở trình duyệt tại: [http://localhost:3000](http://localhost:3000)

### 4. Build Production

```bash
npm run build
npm run start
```

---

## ☁️ Triển khai lên Vercel

1. Đẩy mã nguồn lên kho lưu trữ riêng tư (Private Repository) trên GitHub/GitLab.
2. Đăng nhập vào [Vercel](https://vercel.com) và chọn **Import Project**.
3. Tại phần **Environment Variables**, thêm 3 biến:
   - `AFFIPAD_API_KEY`: API Key được cấp từ AffiPad Dashboard.
   - `AFFIPAD_TOOL_ID`: ID công cụ converter của bạn trên AffiPad.
   - `EXPECTED_AFFILIATE_ID`: `17371590371`
4. Bấm **Deploy**.

---

## 📚 Thông tin API AffiPad

- Tài liệu chính thức: [https://docs.affipad.com/api](https://docs.affipad.com/api)
- Endpoint: `POST https://api.affipad.com/v1/convert`
- Header: `Authorization: Bearer <AFFIPAD_API_KEY>`
- Request Body gửi từ server:
  ```json
  {
    "url": "https://shopee.vn/product/...",
    "toolId": "...",
    "useCache": true,
    "useShortLink": true
  }
  ```
