# Cấu hình Model AI & Cơ chế Fallback

## ✅ Đã hoàn thành

### 1. Danh sách Model AI

Đã cấu hình 3 model AI theo yêu cầu:

1. **gemini-3-flash-preview** (Model mặc định) - Nhanh, tốc độ cao
2. **gemini-3-pro-preview** (Model dự phòng 1) - Phân tích phức tạp
3. **gemini-2.5-flash** (Model dự phòng 2) - Tốc độ cao, chi phí thấp

### 2. Model Mặc Định

- **Model mặc định**: `gemini-3-flash-preview`
- Được tự động khởi tạo khi ứng dụng khởi động
- Lưu trong localStorage để giữ cài đặt sau khi reload trang

### 3. Cơ chế Fallback Tự Động

Hệ thống đã được cấu hình với cơ chế fallback tự động theo thứ tự:

```
gemini-3-flash-preview (mặc định)
    ↓ (nếu lỗi)
gemini-3-pro-preview (dự phòng 1)
    ↓ (nếu lỗi)  
gemini-2.5-flash (dự phòng 2)
```

**Cách hoạt động:**
- Khi model hiện tại gặp lỗi (429 Quota Exceeded, 503 Overloaded, v.v.)
- Hệ thống tự động chuyển sang model tiếp theo
- Thử lần lượt từng model cho đến khi thành công
- Nếu tất cả model đều thất bại, hiển thị thông báo lỗi chi tiết

### 4. File đã cập nhật

**`services/geminiService.ts`:**
- Cập nhật `MODELS` array với 3 model mới
- Cập nhật `MODEL_OPTIONS` cho Settings modal
- Cập nhật `USER_MODELS` với mô tả tiếng Việt
- Cập nhật `AVAILABLE_MODELS` hiển thị trong UI
- Cập nhật `FALLBACK_CHAIN` trong hàm `sendMessageToGemini()`

### 5. Tính năng

✅ Tự động thử lại với model dự phòng khi gặp lỗi
✅ Console log cho việc debug (hiển thị model đang được thử)
✅ Xử lý lỗi cụ thể (429 Quota)
✅ Thông báo lỗi rõ ràng cho người dùng
✅ Lưu trữ model đã chọn vào localStorage
✅ Hiển thị tên model đang sử dụng trong UI

### 6. Cách sử dụng

1. Người dùng có thể chọn model trong Settings
2. Model mặc định sẽ là `gemini-3-flash-preview`
3. Khi gửi tin nhắn, hệ thống sẽ:
   - Thử model được chọn trước
   - Nếu thất bại, tự động fallback theo thứ tự
   - Trả về kết quả từ model đầu tiên thành công
   - Hiển thị thông báo lỗi nếu tất cả đều thất bại

## 📝 Lưu ý

- Người dùng vẫn cần nhập API Key của Google Gemini trong Settings
- Cơ chế fallback hoạt động trong suốt, người dùng không cần can thiệp
- Console log giúp developer debug khi cần thiết
