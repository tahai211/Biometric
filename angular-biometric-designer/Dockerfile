# Sử dụng hình ảnh Node.js làm nền tảng
FROM node:latest AS build

# Tạo thư mục ứng dụng
WORKDIR /app

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các gói phụ thuộc
RUN npm install --force

# Sao chép toàn bộ mã nguồn vào thư mục làm việc
COPY . .

# Xây dựng ứng dụng Angular
RUN npm run build

# Sử dụng hình ảnh Nginx để phục vụ ứng dụng
FROM nginx:alpine

# Sao chép ứng dụng đã xây dựng vào thư mục chứa tệp tĩnh của Nginx
# COPY --from=build /dist /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 để phục vụ ứng dụng
EXPOSE 80

# Khởi chạy Nginx
CMD ["nginx", "-g", "daemon off;"]