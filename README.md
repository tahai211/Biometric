# Biometric
tạo API Gateway
new project => chọn ASP.NET core API 


1: tạo file docker : chuột phải vào project => Add => Docker support (cho từng project con)
2: tạo docker-compose : chuột phải vào project => Add => Container Orchestrator Support (cho từng project con)

3: tạo pipleline cho ứng dụng  
	+ cần có máy chủ để kết nối đến (agent)
	+ setting => Action => Runner => new self-hosted runner (làm theo hướng dẫn để kết nối)
	+.github/actions : hành động lặp lại nhiều lần
	+.github/workflows : CICD pipleline
	
	+ thêm secret 
4: tạo deployment


cài đặt elastic search

Đăng nhập vào Kibana
Mở trình duyệt và truy cập địa chỉ Kibana (ví dụ http://localhost:5601).

Tạo hoặc chọn Index Pattern

Vào Stack Management → Index Patterns.

Nếu trước đó bạn đã tạo, chọn ngay index pattern tương ứng (ví dụ myapp-log-*).

Nếu chưa, nhấn “Create index pattern”, nhập pattern (ví dụ myapp-log-* hoặc theo IndexFormat bạn cấu hình trong Serilog), bấm Next, chọn trường mốc thời gian (@timestamp), rồi Create.

Vào mục Discover

Ở menu bên trái, chọn Discover.

Trong khung chọn index, gõ hoặc chọn myapp-log-* (hoặc index pattern bạn đã tạo).

Ở thanh thời gian (góc trên bên phải), điều chỉnh phạm vi thời gian cho phù hợp (ví dụ “Last 15 minutes”, “Last 1 hour” hoặc khoảng tùy ý).

Xem danh sách log

Trong bảng chính, từng dòng là một document log, bao gồm các cột mặc định như:

@timestamp (thời điểm log được ghi)

Level (mức độ: Information, Warning, Error, v.v.)

MessageTemplate hoặc RenderedMessage (nội dung log)

Properties (các thuộc tính bổ sung bạn đã đính kèm khi gọi Log.Information(…), v.v.)

Lọc hoặc tìm log cụ thể

Với thanh Search (phía trên cột), bạn có thể gõ:

vbnet
Sao chép
Chỉnh sửa
Level: "Error"
để chỉ xem log có mức Error.

Hoặc gõ:

vbnet
Sao chép
Chỉnh sửa
RenderedMessage: "some keyword"
để tìm log chứa từ khoá đó.

Bạn cũng có thể click vào biểu tượng ▶️ cạnh mỗi document để mở rộng và xem tất cả field (full JSON) của log đó.

Tùy chỉnh cột hiển thị

Ở cột bên trái mỗi field có một biểu tượng “☆” (star). Click vào star để ghim trường đó lên bảng. Ví dụ nếu bạn muốn luôn thấy Properties.UserId, click star kế bên trường đó.

Nếu muốn ẩn bớt, click lại star để bỏ ghim.