# Papyrus Landing Website (Nuxt 3)

Trang webapp giới thiệu và tải về chính thức của **Papyrus Browser** được xây dựng bằng **Nuxt 3** và **Vue 3**.

## Tính năng
- Sử dụng chuẩn font chữ tiếng Việt cao cấp: **Be Vietnam Pro** (thân bài) và **Playfair Display** (tiêu đề), hiển thị dấu tiếng Việt hoàn hảo, không bị lỗi font hay nhảy chân chữ.
- Giao diện Parchment (Giấy cói) sang trọng kết hợp Dark Mode mượt mà.
- Khung mô phỏng tương tác trình duyệt trực tiếp (Interactive Browser Mockup).
- Tích hợp sẵn toàn bộ tệp cài đặt thực tế trong thư mục `public/`:
  - `Papyrus-v0.3.7-x64.msi` (Bộ cài đặt Windows)
  - `Papyrus.exe` (Bản Portable chạy ngay)
  - `Papyrus-v0.3.7-windows-x64.zip` (Gói nén ZIP)
  - `SHA256SUMS.txt` (Mã kiểm tra tính toàn vẹn)

## Hướng dẫn chạy

### 1. Khởi chạy môi trường phát triển (Dev Server)
```bash
pnpm install
pnpm dev
```
Trang web sẽ mở tại `http://localhost:3000`.

### 2. Xuất bản tĩnh (Static Site Generation)
```bash
pnpm generate
```
Thư mục xuất bản tĩnh sẽ nằm tại `.output/public`, sẵn sàng deploy lên bất kỳ dịch vụ hosting nào (Cloudflare Pages, Vercel, Netlify, GitHub Pages, Nginx).

### 3. Xem trước bản build production
```bash
pnpm preview
```
