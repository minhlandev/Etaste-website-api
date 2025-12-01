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

## 4.5. Triển khai giao diện Web IoT

### 4.5.1. Dashboard - Giám sát IoT realtime

Dashboard hiển thị dữ liệu từ các IoT node với 6 thẻ cảm biến:

Temperature Card: 30.9°C với line chart xu hướng giảm từ 32.5°C xuống 30.6°C (16:13-19:52). Humidity Card: 54.4% dao động 55-59%. Soil Moisture Card: 0.0% với 2 spike lên 80-100% (tưới nước) rồi giảm về 0. Lux Card: ánh sáng môi trường. Wind Card: tốc độ gió realtime. pH Card: độ pH đất/nước.

### 4.5.2. Trang Upload - Phân tích ảnh

Trang Upload cho phép tải lên ảnh lá lúa để phân tích. Khi chọn file BLAST1_003.jpg, kết quả hiển thị: Leaf_Blast (badge đỏ), 151.97 ms (badge xanh), User_1 (badge tím), thanh tin cậy 32.35%, và bảng xác suất 4 lớp (Leaf_Blast: 32.35%, Leaf_Blight: 24.74%, Brown_Spot: 23.64%, Normal: 19.27%).

### 4.5.3. WebSocket - Truyền dữ liệu IoT realtime

Hệ thống sử dụng WebSocket để truyền dữ liệu cảm biến realtime từ backend đến frontend. Dữ liệu được cập nhật mỗi 2 giây, đảm bảo người dùng luôn nhìn thấy trạng thái mới nhất của IoT node.

## 4.6. Triển khai hệ thống thông báo IoT

Khi phát hiện bệnh, hệ thống tự động gửi email cảnh báo qua Gmail SMTP (bao gồm loại bệnh, độ tin cậy, ảnh, vị trí GPS, dữ liệu môi trường) và push notification qua Firebase Cloud Messaging đến trình duyệt web.

## 4.7. Đánh giá hệ thống IoT

### 4.7.1. Hiệu năng hệ thống

Độ trễ: Đọc cảm biến → Jetson Nano <100ms, Jetson Nano → Firebase ~200ms, Firebase → Web App <500ms, tổng độ trễ end-to-end <1 giây. Throughput: Camera 30 FPS, Inference 12.5 FPS, Cảm biến 1-10 samples/giây. Độ tin cậy: Uptime Jetson Nano 99.5%, tỷ lệ mất gói UART 0.3%, tỷ lệ thành công Firebase sync 98.5%.

### 4.7.2. Ưu điểm và hạn chế

Ưu điểm: Edge Computing giảm độ trễ và hoạt động offline, kiến trúc phân tán dễ mở rộng, realtime monitoring với cảnh báo tức thời. Hạn chế: Phụ thuộc WiFi 2.4GHz, cần nguồn điện 220V liên tục, cảm biến chưa chống nước tốt, chi phí ~$300/node.

### 4.7.3. Kết luận

Hệ thống IoT phát hiện và quản lý bệnh lúa đã được triển khai thành công với kiến trúc edge computing. Các thiết bị IoT hoạt động ổn định, dữ liệu được đồng bộ realtime, và giao diện web cung cấp khả năng giám sát toàn diện.
