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