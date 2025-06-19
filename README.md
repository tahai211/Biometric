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








#################################################### CÁC CÔNG NGHỆ CƠ BẢN #########################################

#HOÀN THÀNH
🔧 1. Redis – Caching & Pub/Sub 
Dùng để: Lưu cache, session, hoặc dùng làm message queue nhẹ.

Tốc độ cao (in-memory), rất phù hợp cho dữ liệu cần truy xuất nhanh.

Use case: Cache danh sách, token, tạm lưu dữ liệu form, thống kê truy cập,…

🧵 2. Hangfire – Background Jobs (cho .NET)
Dùng để: Chạy tác vụ nền (gửi mail, tạo báo cáo, đồng bộ dữ liệu).

Có Dashboard, retry tự động, lưu log job.

Thay thế tốt cho việc tự tạo Task.Run() hoặc IHostedService.

Tích hợp dễ với RabbitMQ, Redis, SQL Server,…

🧪 3. OpenTelemetry – Monitoring, Tracing
Dùng để: Theo dõi log, trace, hiệu suất từng request.

Kết hợp với Prometheus, Jaeger, Grafana.

Giúp dev/devops nhanh chóng tìm ra lỗi hoặc performance bottleneck.

#HOÀN THÀNH
🛠️ 4. Serilog + Seq / ELK Stack – Logging
Serilog (hoặc NLog) để log có cấu trúc (structured logging).

Seq, Elasticsearch-Kibana (ELK), hay Grafana Loki để hiển thị & tìm kiếm log nhanh chóng.

#CHƯA LÀM (chỉ áp dụng chủ yếu vào trafic và quản lý service cho microservice)
🌐 5. Consul / Eureka / Istio – Service Discovery / API Gateway
Quản lý các service trong hệ thống microservices.

Tự động tìm và kết nối service mà không cần hardcode IP.

Có thể đi kèm với các tool như Ocelot, YARP nếu bạn muốn API Gateway.

#KHÔNG DÙNG (Đã tự dựng JWT để xác thực)
🛡️ 6. IdentityServer / Keycloak / Auth0 – Centralized Authentication
Dùng để quản lý đăng nhập/ủy quyền (OAuth2, OpenID Connect).

Thay cho việc mỗi app phải tự viết xác thực từ đầu.

Có thể tích hợp SSO, MFA, quản lý người dùng,…

#KHÔNG DÙNG
📊 7. MediatR – CQRS / Clean Architecture trong .NET
Tách logic xử lý khỏi controller.

Dễ mở rộng, dễ test, phù hợp với kiến trúc theo hướng domain.

☁️ 8. MinIO / S3 – Object Storage
Lưu file, ảnh, backup,…

MinIO chạy được local hoặc on-premise, S3 thì dùng AWS.

Dễ tích hợp vào web app cần upload file.

####    ĐÂY LÀ TRONG KIẾN TRÚC MICROSERVICE


🧩 1. Kiến trúc tổng quan
.NET 8 / ASP.NET Core Web API: cho mỗi service riêng biệt

Clean Architecture / DDD / CQRS: áp dụng cho cấu trúc dự án từng service

REST / gRPC: dùng để giao tiếp giữa các service (tùy use case)

📦 2. Giao tiếp giữa các service
HTTP REST với HttpClient hoặc Refit

gRPC: hiệu suất cao, tốt cho service-to-service

Message Broker (asynchronous):

RabbitMQ, Apache Kafka, hoặc Azure Service Bus

Dùng qua thư viện MassTransit, CAP, hoặc NServiceBus

📚 3. Quản lý cấu hình
.NET Configuration Provider

Consul, etcd, hoặc Azure App Configuration (phân tán)

Dùng thêm Vault để quản lý secrets (nếu cần)

🔑 4. Xác thực & Phân quyền (AuthN & AuthZ)
JWT Bearer Token

IdentityServer (self-hosted OpenID Connect)

Keycloak, Auth0, Azure AD B2C

API Gateway chịu trách nhiệm xác thực token (giảm gánh nặng cho từng service)

🚪 5. API Gateway
YARP (Yet Another Reverse Proxy) – native .NET

Ocelot – phổ biến, dễ dùng

NGINX / Traefik – nếu triển khai trên container/K8s

🧠 6. Service Discovery
Consul, Eureka, hoặc sử dụng tính năng DNS của Kubernetes

Cho phép API Gateway hoặc các service tìm địa chỉ thực của nhau

🐘 7. Cơ sở dữ liệu
SQL: PostgreSQL, SQL Server, MySQL (dùng EF Core, Dapper)

NoSQL: MongoDB, Redis, Elasticsearch

Mỗi service nên own database riêng biệt (Database-per-service)

🧾 8. Event Sourcing / Message Bus (nếu CQRS)
EventStoreDB cho Event Sourcing

RabbitMQ / Kafka để publish domain events

Outbox Pattern để đảm bảo độ tin cậy khi publish

📈 9. Logging – Tracing – Monitoring
Logging: Serilog + Elasticsearch + Kibana (ELK stack) hoặc Seq

Tracing: OpenTelemetry + Jaeger / Zipki + Loki

Metrics: Prometheus + Grafana

Health Check: Microsoft.AspNetCore.Diagnostics.HealthChecks

🕰️ 10. Background Jobs
Hangfire (có dashboard UI)

Quartz.NET

Worker Service (.NET hosted background service)

🔄 11. CI/CD – DevOps
GitHub Actions, Azure DevOps, GitLab CI

Docker: container hóa từng service

Kubernetes: orchestration

Helm: quản lý chart, version

Terraform: IaC cho hạ tầng

ArgoCD : triển khai (deployment) GitOps mã nguồn mở dành cho Kubernetes.

+ Teraform cài các công cụ cần thiết gồm cả helm và ArgoCD 
+ Commit code => jenkins/Git (Build image + push lên Registry + commit code mới ) => ArgoCD check commit và cập nhật code mới lên k8s 

🎨 12. Frontend hoặc Client
Angular / React / Blazor WebAssembly (dùng IdentityServer hoặc token từ Auth)

Call về API Gateway (hoặc trực tiếp tới service nếu cho phép)

