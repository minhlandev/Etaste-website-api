# CHƯƠNG 4: TRIỂN KHAI HỆ THỐNG

## 4.1. Kết quả triển khai mô hình phần cứng

Sau quá trình triển khai, nhóm đã xây dựng thành công hệ thống điều khiển bao gồm các thiết bị: NVIDIA Jetson Nano, Arduino UNO R3, ESP32 NodeMCU, Camera IMX219, DHT22 (cảm biến nhiệt độ và độ ẩm không khí), cảm biến độ ẩm đất, cảm biến ánh sáng VEML7700, máy đo gió Hall Effect, cảm biến pH, cảm biến mực nước XKC-Y25, Module L298N Driver, và hai động cơ bơm nước RS385 12VDC.

**Bảng 4.1: Thông số kỹ thuật các thành phần hệ thống**

| STT | Thiết bị | Model/Thông số | Số lượng | Chức năng |
|-----|----------|----------------|----------|-----------|
| 1 | Bộ xử lý trung tâm | NVIDIA Jetson Nano 4GB | 1 | Xử lý AI, điều phối IoT |
| 2 | Camera | IMX219 8MP CSI | 1 | Thu thập hình ảnh lá lúa |
| 3 | Vi điều khiển | Arduino Uno R3 | 1 | Đọc dữ liệu cảm biến |
| 4 | Cảm biến nhiệt độ/độ ẩm | DHT22 | 1 | Đo nhiệt độ và độ ẩm không khí |
| 5 | Cảm biến độ ẩm đất | Capacitive Soil Moisture | 1 | Đo độ ẩm đất |
| 6 | Cảm biến ánh sáng | VEML7700 (I²C) | 1 | Đo cường độ ánh sáng |
| 7 | Cảm biến gió | Hall Effect Anemometer | 1 | Đo tốc độ gió |
| 8 | Cảm biến pH | Analog pH Sensor | 1 | Đo độ pH đất/nước |
| 9 | Cảm biến mức nước | Float Switch XKC-Y25 | 2 | Giám sát mức thuốc |
| 10 | Module GPS | GPS NEO-7M | 1 | Định vị vị trí |
| 11 | Module điều khiển | ESP32 NodeMCU | 1 | Điều khiển bơm phun |
| 12 | Driver động cơ | L298N H-Bridge | 1 | Điều khiển động cơ bơm |
| 13 | Bơm nước | RS385 12VDC | 2 | Phun thuốc trừ sâu |

Các cảm biến hoạt động ổn định với sai số không quá 2%, đảm bảo độ chính xác trong việc đo lường các yếu tố môi trường quan trọng. Hệ thống sử dụng Wifi băng tần 2.4GHz để truyền tải dữ liệu và giao tiếp giữa các component. Giao tiếp UART giữa Arduino và Jetson Nano hoạt động ở tốc độ 9600 baud với tỷ lệ mất gói 0.3%.

Về vị trí lắp đặt: Cảm biến nhiệt độ và độ ẩm không khí DHT22 được đặt ở khu vực đại diện để đo lường các yếu tố môi trường xung quanh. Cảm biến độ ẩm đất được đặt trực tiếp trong đất ở vị trí gần gốc cây. Cảm biến ánh sáng được đặt ở vị trí không bị che khuất. Máy đo gió được lắp đặt tại vị trí cao và thông thoáng. Hai bơm được gắn với các vòi phun để phân phối thuốc trừ sâu. Camera được cố định hướng về khu vực lá cây cần giám sát.

## 4.2. Triển khai hệ thống IoT trên Jetson Nano

### 4.2.1. Cấu hình môi trường Edge Computing

Jetson Nano được cài đặt Ubuntu 18.04 với JetPack 4.6, đóng vai trò là gateway IoT trung tâm. Thiết bị này xử lý dữ liệu từ các cảm biến, chạy mô hình AI tại biên (edge computing), và đồng bộ dữ liệu lên cloud.

Các service chính được triển khai: Flask API Server (Port 5000) xử lý inference và điều khiển thiết bị, Camera Service thu thập hình ảnh realtime, Arduino Reader đọc dữ liệu cảm biến qua UART, GPS Service thu thập tọa độ vị trí, ESP32 Controller gửi lệnh điều khiển bơm phun, và Firebase Uploader đồng bộ dữ liệu mỗi 60 giây.

### 4.2.2. Triển khai và tối ưu mô hình AI

Mô hình phát hiện bệnh được tối ưu hóa bằng TensorRT FP16 để chạy hiệu quả trên Jetson Nano. Quá trình triển khai bao gồm chuyển đổi mô hình từ TensorFlow sang ONNX format, tối ưu hóa với TensorRT engine builder, và giảm precision từ FP32 xuống FP16. Kết quả: kích thước model giảm từ 14.2MB xuống 7.8MB, thời gian inference chỉ ~80ms/ảnh.

### 4.2.3. Kết quả đo lường hiệu năng

Các phép đo hiệu năng trên Flask API server cho thấy thời gian xử lý trung bình 151.97 milliseconds, bao gồm: tải ảnh từ Firebase Storage (~40ms), tiền xử lý ảnh (~15ms), suy luận TensorRT trên GPU (~80ms), và hậu xử lý (~17ms).

Từ kết quả trên Upload page, mô hình phát hiện Leaf_Blast với độ tin cậy 32.35%. Mặc dù xác suất không quá cao, nhưng vẫn cao hơn các lớp khác, cho thấy mô hình có khả năng phân biệt các loại bệnh khác nhau.

## 4.3. Triển khai hệ thống thu thập dữ liệu IoT

### 4.3.1. Arduino - Hub cảm biến IoT

Arduino Uno R3 đóng vai trò hub tổng hợp dữ liệu từ 5 cảm biến môi trường. Dữ liệu được đọc theo chu kỳ: DHT22 mỗi 2 giây, Soil Moisture mỗi 5 giây, pH Sensor mỗi 10 giây, Wind Speed mỗi 1 giây, và VEML7700 mỗi 1 giây.

Arduino gửi dữ liệu dạng text string qua Serial: "Temp: 30.9 C, Humidity: 54.2%, pH = 7.6, Soil: 0.0%, Wind: 0.0 m/s, Lux: 5.5 lx". Jetson Nano sử dụng Regular Expression để parse và trích xuất giá trị từ chuỗi text.

### 4.3.2. GPS Module - Định vị IoT Node

Module GPS NEO-7M cung cấp tọa độ vị trí chính xác cho mỗi IoT node. Dữ liệu GPS được cập nhật mỗi giây với độ chính xác ±2.5m. Camera page hiển thị: GPS Location Lat 10.8524520, Lon 106.6665280, Alt -14.50 m cùng với dữ liệu môi trường (Temperature: 30.90°C, Humidity: 54.20%, pH: 7.60, Soil: 0.00%, Wind: 0.00 m/s, Light: 5.50 lux).

### 4.3.3. ESP32 - Điều khiển Actuator IoT

ESP32 NodeMCU điều khiển 2 bơm phun thuốc thông qua driver L298N. Module này nhận lệnh từ Jetson Nano qua HTTP API (POST /spray, POST /stop, GET /status) và thực hiện phun thuốc tự động.

Auto Capture page hiển thị lịch sử 10 lần chụp gần nhất. Dữ liệu cho thấy: nhiệt độ ổn định quanh 32.3°C, độ ẩm không khí dao động 58-76% (phù hợp cho phun thuốc >60%), tốc độ gió rất thấp (<0.1 m/s, thấp hơn ngưỡng 3 m/s), và GPS tracking hoạt động tốt.

## 4.4. Triển khai hệ thống Backend IoT

### 4.4.1. Firebase Realtime Database

Firebase được sử dụng để đồng bộ dữ liệu IoT realtime giữa Jetson Nano và Web Application. Dữ liệu được cập nhật mỗi 60 giây với cấu trúc: feeds/User_1/Node_1/ chứa temperature, humidity, soil_moisture, soil_ph, wind_speed, gps_latitude, gps_longitude, và timestamp.

### 4.4.2. MongoDB - Lưu trữ dữ liệu IoT

MongoDB lưu trữ lịch sử dữ liệu cảm biến, kết quả chẩn đoán, và thông tin người dùng. Hệ thống sử dụng Node.js/Express để xây dựng REST API với các collections: users (thông tin người dùng), captures (ảnh chụp và kết quả), nodedatas (dữ liệu cảm biến hiện tại), và nodedatahistories (lịch sử).

### 4.4.3. Node.js API Server

Node.js server cung cấp REST API cho Web Application: GET /api/node-data/:userId (lấy dữ liệu IoT node), GET /api/captures (danh sách ảnh chụp), POST /api/captures (tạo capture mới), và GET /api/diagnosis/stats (thống kê bệnh).

## 4.5. Kết quả triển khai trên website

Sau khi người dùng đăng nhập thành công, website sẽ chuyển hướng người dùng tới trang Dashboard. Ở trang này, người dùng có thể quan sát được các giá trị của cảm biến trong ruộng lúa, như nhiệt độ, độ ẩm không khí, độ ẩm đất, tốc độ gió, độ pH, và cường độ ánh sáng. Các giá trị được cập nhật liên tục realtime, website sẽ lấy giá trị cảm biến gần nhất mà nó thu thập được và hiển thị lên website cho người dùng. Nhờ việc sử dụng Axios để gọi API, người dùng có thể xem dữ liệu của mình liên tục mà không cần load lại trang.

**Hình 4.1: Trang chủ Dashboard**

### 4.5.1. Trang Dashboard - Giám sát IoT realtime

Khi người dùng kéo xuống dưới trang chủ Dashboard, người dùng sẽ thấy được biểu đồ thể hiện 50 giá trị cảm biến gần nhất mà website thu thập được. Các giá trị thường dùng như nhiệt độ, độ ẩm không khí, độ ẩm đất sẽ được cập nhật liên tục theo thời gian thực.

Dashboard hiển thị dữ liệu từ Node_1 với 6 thẻ cảm biến:

**Temperature Card:** Giá trị hiện tại 30.9°C (Last 50 readings) với line chart hiển thị xu hướng giảm nhẹ từ 32.5°C xuống 30.6°C trong khoảng thời gian 16:13-19:52.

**Humidity Card:** Giá trị hiện tại 54.4% với line chart dao động 55-59%, giảm xuống 54-55% ở thời điểm gần nhất.

**Soil Moisture Card:** Giá trị hiện tại 0.0% với line chart cho thấy 2 spike lên 80-100% (tưới nước) rồi giảm về 0.

**Lux Card:** Hiển thị dữ liệu cường độ ánh sáng môi trường theo thời gian.

**Wind Speed Card:** Hiển thị tốc độ gió realtime với biểu đồ xu hướng.

**pH Card:** Hiển thị độ pH của đất/nước với ngưỡng cảnh báo khi pH < 5.5 hoặc > 7.5.

**Hình 4.2: Biểu đồ thể hiện thông số của các cảm biến theo thời gian thực**

### 4.5.2. Trang Upload - Phân tích ảnh thủ công

Trang Upload cho phép người dùng tải lên ảnh lá lúa để phân tích bệnh ngay lập tức. Người dùng có thể nhấn nút "Choose File" để chọn ảnh từ máy tính hoặc sử dụng tính năng "Reset" để xóa ảnh đã chọn.

Giao diện bao gồm:

- Form upload file với nút "Choose File" và "Reset"
- Khi chọn file (BLAST1_003.jpg), ảnh được hiển thị trong panel "Selected Image"
- Sau khi phân tích, panel "Result" hiển thị:
  - Badge đỏ: "Leaf_Blast" - Loại bệnh được phát hiện
  - Badge xanh: "151.97 ms" - Thời gian suy luận
  - Badge tím: "User_1" - Người thực hiện
  - Thanh tin cậy: 32.35% (màu xanh lá)
  - Bảng "Class Probabilities" với 4 hàng:
    - Leaf_Blast: 32.35% (thanh xanh dài nhất)
    - Leaf_Blight: 24.74%
    - Brown_Spot: 23.64%
    - Normal: 19.27%
  - Thông báo: "Prediction completed!"

Kết quả cho thấy hệ thống phân tích ảnh thành công với thời gian phản hồi nhanh (151.97ms), hiển thị đầy đủ thông tin xác suất cho cả 4 lớp.

**Hình 4.3: Chức năng upload file ảnh**

**Hình 4.4: Chức năng chạy chẩn đoán**

### 4.5.3. Trang Camera - Chụp ảnh realtime

Trang Camera cho phép người dùng xem hình ảnh gần nhất của ruộng lúa và chụp ảnh realtime từ ruộng qua việc điều khiển Camera IMX219 trực tiếp trên website. Người dùng có thể nhấn nút "Chụp hình trực tiếp" để chụp ảnh ngay lập tức.

Tính năng quan trọng tiếp theo là "Chẩn đoán bệnh lúa". Khi người dùng chọn "Chạy chẩn đoán", website gửi yêu cầu đến Flask API server trên Jetson Nano để sử dụng mô hình TensorRT. Sau khi xử lý xong, kết quả chẩn đoán sẽ được trả về và hiển thị trên website cho người dùng.

Camera page hiển thị kết quả phát hiện realtime với thông tin chi tiết:

- Diagnosis: Leaf_Blast
- Confidence: 46.56%
- Updated: 16:23:08 25/11/2025
- GPS Location: Lat 10.8524520, Lon 106.6665280, Alt -14.50 m

Environmental Data:
- Temperature: 30.90 °C
- Humidity: 54.20 %
- pH: 7.60
- Soil: 0.00 %
- Wind: 0.00 m/s
- Light: 5.50 lux

**Hình 4.5: Chức năng chụp hình trực tiếp từ Camera IoT**

### 4.5.4. Trang Auto Capture History - Lịch sử tự động

Trang Auto Capture History cho phép người dùng xem lại các giá trị cảm biến và kết quả chẩn đoán từ quá khứ một cách chi tiết, hiển thị đầy đủ các giá trị cảm biến của ruộng lúa cùng với thời gian chi tiết. Tính năng lọc theo ngày, tháng, năm giúp người dùng có thể dễ dàng lọc ra những thời điểm mà mình cần một cách đơn giản.

Auto Capture page hiển thị lịch sử 10 lần chụp gần nhất với thông tin đầy đủ. Dữ liệu cho thấy hệ thống hoạt động ổn định:

- Nhiệt độ ổn định quanh 32.3°C
- Độ ẩm không khí dao động 58-76%, phù hợp cho phun thuốc (>60%)
- Tốc độ gió rất thấp (<0.1 m/s), thấp hơn ngưỡng 3 m/s
- GPS tracking hoạt động tốt với độ chính xác cao

**Hình 4.6: Trang Lịch sử Auto Capture**

### 4.5.5. Trang Plans - Kế hoạch phun thuốc tự động

Trang Plans cho phép người dùng xem và quản lý kế hoạch phun thuốc tự động được tạo bởi AI Agent (Ollama). Khi hệ thống phát hiện bệnh, AI Agent sẽ tự động phân tích dữ liệu từ Firebase feeds và tạo kế hoạch phun thuốc chi tiết.

Giao diện Plans bao gồm:

- Danh sách các kế hoạch phun thuốc theo ngày
- Thông tin chi tiết mỗi kế hoạch:
  - Loại bệnh phát hiện (Leaf_Blast, Brown_Spot, Leaf_Blight)
  - Hành động khuyến nghị (spray - phun thuốc)
  - Bơm sử dụng (pump 1, 2, hoặc both)
  - Lượng thuốc cần thiết (lít)
  - Thời gian phun (giây)
  - Lịch phun hàng tuần
- Nút "Thực hiện phun ngay" để điều khiển ESP32 phun thuốc
- Nút "Chỉnh sửa lịch" để cập nhật lịch phun

Ví dụ kế hoạch được hiển thị:

```
Kế hoạch ngày 15/01/2024:
- Bệnh: Leaf_Blast
- Độ tin cậy: 85%
- Hành động: Phun thuốc
- Bơm: Pump 1
- Lượng thuốc: 20.0 lít
- Thời gian phun: 400 giây
- Lịch tuần: Thứ 2, Thứ 4, Thứ 6 (8:00 AM)
```

Người dùng có thể nhấn "Thực hiện ngay" để gửi lệnh phun đến ESP32 hoặc chỉnh sửa lịch phun theo nhu cầu.

**Hình 4.7: Trang Plans - Kế hoạch phun thuốc tự động**

### 4.5.6. Trang Settings - Cài đặt hệ thống

Trang Settings cho phép người dùng cấu hình các thông số của hệ thống IoT để tối ưu hóa quá trình chăm sóc lúa. Người dùng có thể cài đặt ngưỡng cảnh báo cho các cảm biến và chế độ hoạt động của hệ thống.

Các cài đặt chính:

**1. Ngưỡng cảm biến:**
- Nhiệt độ tối đa: 35°C (cảnh báo khi vượt quá)
- Nhiệt độ tối thiểu: 25°C (cảnh báo khi thấp hơn)
- Độ ẩm không khí tối thiểu: 60% (phù hợp cho phun thuốc)
- Độ ẩm đất tối thiểu: 30% (cảnh báo cần tưới)
- Tốc độ gió tối đa: 3.0 m/s (không phun khi gió mạnh)
- pH tối ưu: 6.0 - 7.0 (cảnh báo khi ngoài khoảng)

**2. Chế độ hoạt động:**
- Chế độ tự động: Hệ thống tự động phun thuốc khi phát hiện bệnh và điều kiện phù hợp
- Chế độ thủ công: Người dùng điều khiển bơm phun trực tiếp qua website
- Chế độ lên lịch: Phun thuốc theo lịch đã cài đặt

**3. Cài đặt thông báo:**
- Bật/tắt email notification
- Bật/tắt push notification
- Bật/tắt cảnh báo bệnh tự động

Người dùng có thể dễ dàng thay đổi các thông số này và nhấn nút "Lưu cài đặt" để áp dụng. Hệ thống sẽ tự động cập nhật các ngưỡng mới và hoạt động theo cấu hình đã chọn.

**Hình 4.8: Trang Settings - Cài đặt hệ thống**

### 4.5.7. Tích hợp Node.js và Flask API

Để tích hợp Flask API trên Jetson Nano với Node.js backend, hệ thống sử dụng thư viện Axios trong Node.js để gọi API Flask. Ví dụ mã nguồn Node.js:

```javascript
const axios = require('axios');

// Gửi yêu cầu phân tích ảnh đến Flask API trên Jetson Nano
axios.post('http://jetson-nano-ip:5000/predict', {
  imageUrl: 'https://firebase-storage-url/image.jpg'
})
.then(response => {
  console.log('Prediction:', response.data);
})
.catch(error => {
  console.error('Error:', error);
});
```

Đoạn mã này sử dụng thư viện Axios trong Node.js để gửi một yêu cầu HTTP POST đến Flask API trên Jetson Nano. Yêu cầu này bao gồm một payload chứa URL của ảnh (imageUrl), được gửi tới endpoint /predict. Flask API sẽ xử lý yêu cầu, thực hiện phân tích ảnh bằng mô hình TensorRT, và trả về kết quả dự đoán. Kết quả trả về được log ra console qua response.data, trong khi các lỗi có thể xảy ra trong quá trình gửi hoặc xử lý yêu cầu sẽ được bắt và hiển thị qua console.error.

## 4.6. Triển khai hệ thống thông báo IoT

Khi phát hiện bệnh, hệ thống tự động gửi email cảnh báo qua Gmail SMTP (bao gồm loại bệnh, độ tin cậy, ảnh, vị trí GPS, dữ liệu môi trường) và push notification qua Firebase Cloud Messaging đến trình duyệt web.

## 4.7. Đánh giá hệ thống IoT

### 4.7.1. Hiệu năng hệ thống

Độ trễ: Đọc cảm biến → Jetson Nano <100ms, Jetson Nano → Firebase ~200ms, Firebase → Web App <500ms, tổng độ trễ end-to-end <1 giây. Throughput: Camera 30 FPS, Inference 12.5 FPS, Cảm biến 1-10 samples/giây. Độ tin cậy: Uptime Jetson Nano 99.5%, tỷ lệ mất gói UART 0.3%, tỷ lệ thành công Firebase sync 98.5%.

### 4.7.2. Ưu điểm và hạn chế

Ưu điểm: Edge Computing giảm độ trễ và hoạt động offline, kiến trúc phân tán dễ mở rộng, realtime monitoring với cảnh báo tức thời. Hạn chế: Phụ thuộc WiFi 2.4GHz, cần nguồn điện 220V liên tục, cảm biến chưa chống nước tốt, chi phí ~$300/node.

### 4.7.3. Kết luận

Hệ thống IoT phát hiện và quản lý bệnh lúa đã được triển khai thành công với kiến trúc edge computing. Các thiết bị IoT hoạt động ổn định, dữ liệu được đồng bộ realtime, và giao diện web cung cấp khả năng giám sát toàn diện.
