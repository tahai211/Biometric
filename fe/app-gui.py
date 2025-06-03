
import tkinter as tk
from tkinter import font as tkfont
from tkinter import filedialog,messagebox,PhotoImage,scrolledtext
import tkinter as tk
from tkinter import messagebox
import hashlib
import cv2
import dlib
import numpy as np
import base64
from pyzbar.pyzbar import decode
from PIL import Image
import numpy as np
import requests
import time
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
shape_predictor_path = os.path.join(current_dir, "data", "shape_predictor_68_face_landmarks.dat")
face_recognition_model_path = os.path.join(current_dir, "data", "dlib_face_recognition_resnet_model_v1.dat")
names = set()

class MainUI(tk.Tk):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Thiết lập font chữ, tiêu đề và kích thước của ứng dụng
        self.title_font = tkfont.Font(family='Helvetica', size=16, weight="bold")
        self.title("Face Recognizer")
        self.resizable(False, False)
        self.geometry("500x250")
        self.protocol("WM_DELETE_WINDOW", self.on_closing)  # Xử lý khi đóng cửa sổ

        self.active_name = None
        container = tk.Frame(self)
        container.grid(sticky="nsew")
        container.grid_rowconfigure(0, weight=1)
        container.grid_columnconfigure(0, weight=1)

        # Tạo và lưu các trang vào `self.frames`
        self.frames = {}
        for F in (StartPage, PageOne, PageTwo, PageThree, PageFour):
            page_name = F.__name__
            frame = F(parent=container, controller=self)
            self.frames[page_name] = frame
            frame.grid(row=0, column=0, sticky="nsew")

        self.show_frame("StartPage")  # Hiển thị trang đầu tiên

    def show_frame(self, page_name):
        # Hiển thị trang theo `page_name`
        frame = self.frames[page_name]
        frame.tkraise()

    def on_closing(self):
        # Hỏi người dùng có chắc muốn thoát không
        if messagebox.askokcancel("Quit", "Are you sure?"):
            self.destroy()

class StartPage(tk.Frame):

        def __init__(self, parent, controller):
            tk.Frame.__init__(self, parent)
            self.controller = controller
            #load = Image.open("homepagepic.png")
            #load = load.resize((250, 250), Image.ANTIALIAS)
            render = PhotoImage(file='homepagepic.png')
            img = tk.Label(self, image=render)
            img.image = render
            img.grid(row=0, column=1, rowspan=4, sticky="nsew")
            label = tk.Label(self, text="        Home Page        ", font=self.controller.title_font,fg="#263942")
            label.grid(row=0, sticky="ew")
            button1 = tk.Button(self, text="   Regenerate QR  ", fg="#ffffff", bg="#263942",command=lambda: self.controller.show_frame("PageOne"))
            button2 = tk.Button(self, text="   Check a User  ", fg="#ffffff", bg="#263942",command=lambda: self.controller.show_frame("PageTwo"))
            button3 = tk.Button(self, text="Quit", fg="#263942", bg="#ffffff", command=self.on_closing)
            button1.grid(row=1, column=0, ipady=3, ipadx=7)
            button2.grid(row=2, column=0, ipady=3, ipadx=2)
            button3.grid(row=3, column=0, ipady=3, ipadx=32)


        def on_closing(self):
            if messagebox.askokcancel("Quit", "Are you sure?"):
                self.controller.destroy()


class PageOne(tk.Frame):
    def __init__(self, parent, controller):
        super().__init__(parent)
        self.controller = controller
        self.data_user = None
        self.capturing = False
        self.num_of_images = 0

        # Khởi tạo giao diện người dùng
        tk.Label(self, text="Full Name", fg="#263942", font='Helvetica 12 bold').grid(row=0, column=0, pady=10, padx=5)
        self.full_name = tk.Entry(self, borderwidth=3, bg="lightgrey", font='Helvetica 11')
        self.full_name.grid(row=0, column=1, pady=10, padx=10)

        tk.Label(self, text="Phone", fg="#263942", font='Helvetica 12 bold').grid(row=1, column=0, pady=10, padx=5)
        self.phone = tk.Entry(self, borderwidth=3, bg="lightgrey", font='Helvetica 11')
        self.phone.grid(row=1, column=1, pady=10, padx=10)

        tk.Label(self, text="Password", fg="#263942", font='Helvetica 12 bold').grid(row=2, column=0, pady=10, padx=5)
        self.password = tk.Entry(self, borderwidth=3, bg="lightgrey", font='Helvetica 11', show="*")
        self.password.grid(row=2, column=1, pady=10, padx=10)

        self.button_cancel = tk.Button(self, text="Cancel", bg="#ffffff", fg="#263942", command=lambda: controller.show_frame("StartPage"))
        self.button_cancel.grid(row=3, column=0, pady=10, ipadx=5, ipady=4)

        self.button_submit = tk.Button(self, text="Submit", fg="#ffffff", bg="#263942", command=self.submit_data)
        self.button_submit.grid(row=3, column=1, pady=10, ipadx=5, ipady=4)

        self.numimglabel = tk.Label(self, text="Number of images captured = 0", font='Helvetica 12 bold', fg="#263942")
        self.numimglabel.grid(row=4, column=0, columnspan=2, sticky="ew", pady=10)
        self.info_text = scrolledtext.ScrolledText(self, width=50, height=10, font='Helvetica 10')
        self.info_text.grid(row=5, column=0, columnspan=2, padx=10, pady=10)

        # Khởi tạo Dlib
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor(shape_predictor_path)
        self.net = dlib.face_recognition_model_v1(face_recognition_model_path)

    def submit_data(self):
        full_name = self.full_name.get().strip()
        phone = self.phone.get().strip()
        password = self.password.get().strip()

        if not full_name or not phone or not password:
            messagebox.showerror("Error", "All fields must be filled!")
            return

        # Mã hóa password bằng SHA-256
        password_hash = hashlib.sha256(password.encode()).hexdigest()

        # Tạo dữ liệu QR
        self.data_user = {"name": full_name, "phone": phone, "password": password_hash}

        # Bắt đầu hiển thị camera để căn chỉnh khuôn mặt
        self.start_camera_view()

    def start_camera_view(self):
        self.cap = cv2.VideoCapture(0)
        self.capturing = True
        start_time = time.time()

        while self.capturing:
            ret, frame = self.cap.read()
            if not ret:
                break

            # Vẽ khung căn chỉnh khuôn mặt (hình chữ nhật màu xanh lá)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.detector(gray)
            for face in faces:
                # Vẽ hình chữ nhật quanh khuôn mặt
                top, right, bottom, left = face.top(), face.right(), face.bottom(), face.left()
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

                # Kiểm tra xem đã qua 3 giây chưa và có khuôn mặt rõ ràng không
                if time.time() - start_time >= 2:
                    if self.is_face_clear(gray, face):
                        self.process_frame(frame)
                        self.capturing = False
                        break

            cv2.imshow("Align your face within the frame", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        self.stop_capture()

    def is_face_clear(self, gray, face):
        # Cắt ảnh khuôn mặt
        face_img = gray[face.top():face.bottom(), face.left():face.right()]

        # Kiểm tra độ nét sử dụng Laplacian
        laplacian_var = cv2.Laplacian(face_img, cv2.CV_64F).var()
        threshold = 100  # Ngưỡng độ nét

        return laplacian_var > threshold

    def process_frame(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.detector(gray)

        if len(faces) == 1:
            face = faces[0]
            shape = self.predictor(gray, face)
            face_chip = dlib.get_face_chip(frame, shape)
            descriptor = self.net.compute_face_descriptor(face_chip)

            # Chuyển descriptor thành base64
            descriptor_bytes = np.array(descriptor).astype(np.float32).tobytes()
            base64_descriptor = base64.b64encode(descriptor_bytes).decode('utf-8')

            # Gửi dữ liệu đến API
            self.send_data_to_api(self.data_user, base64_descriptor)

    def stop_capture(self):
        self.capturing = False
        self.cap.release()
        cv2.destroyAllWindows()

    def send_data_to_api(self, data_user, base64_descriptor):
        url = "http://192.168.188.138:5000/biometric/regenerateQR"
        payload = {**data_user, "faceData": base64_descriptor}

        try:
            response = requests.post(url, json=payload, verify=False)
            if response.status_code == 200:
                messagebox.showinfo("Success", "Request created successfully, please wait for admin approval.")
            else:
                messagebox.showerror("Error", f"Failed to send data: {response.status_code} - Response: {response.text}")
        except requests.exceptions.RequestException as e:
            messagebox.showerror("Error", f"An error occurred: {e}")


class PageTwo(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)
        self.controller = controller
        self.cap = None
        self.capturing = False
        
        # Biến để theo dõi trạng thái camera
        self.camera_running = False

        # Nhãn và nút
        tk.Label(self, text="QR Code Scanner", fg="#263942", font='Helvetica 12 bold').grid(row=0, column=0, padx=10, pady=10)
        
        self.scan_button = tk.Button(self, text="Scan QR Code from Camera", command=self.start_camera, fg="#ffffff", bg="#263942")
        self.scan_button.grid(row=1, column=0, padx=10, pady=10)
        
        self.import_button = tk.Button(self, text="Import Image", command=self.import_image, fg="#ffffff", bg="#263942")
        self.import_button.grid(row=1, column=1, padx=10, pady=10)
        
        self.buttoncanc = tk.Button(self, text="Cancel", command=lambda: controller.show_frame("StartPage"), bg="#ffffff", fg="#263942")
        self.buttoncanc.grid(row=2, column=0, padx=10, pady=10)

    def start_camera(self):
        # Khởi động camera
        self.camera_running = True
        self.scan_qr_camera()

    def scan_qr_camera(self):
        self.cap = cv2.VideoCapture(0)
        self.capturing = True
        start_time = time.time()

        while self.capturing:
            ret, frame = self.cap.read()
            if not ret:
                print("Failed to capture frame. Exiting...")
                break
            
            # Đọc và giải mã mã QR
            qr_codes = decode(frame)
            qr_data = ''
            for qr_code in qr_codes:
                # Lấy nội dung mã QR
                qr_data = qr_code.data.decode('utf-8')
                print(f"QR Code detected: {qr_data}")

                # Vẽ khung xung quanh mã QR
                points = qr_code.polygon
                if len(points) > 4:
                    hull = cv2.convexHull(np.array([point for point in points], dtype=np.float32))
                    points = hull.reshape((-1, 1, 2))
                else:
                    points = np.array([[point.x, point.y] for point in points], dtype=np.int32)
                cv2.polylines(frame, [points], True, (0, 255, 0), 2)

                # Hiển thị nội dung mã QR trên khung hình
                rect = qr_code.rect
                cv2.putText(frame, qr_data, (rect.left, rect.top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                # Dừng khi phát hiện mã QR
                self.capturing = False
                break

            # Hiển thị khung hình
            cv2.imshow("Scan QR Code", frame)
            if qr_data != '' and len(qr_data) > 30:
                self.controller.frames["PageThree"].update_qr_data(qr_data)
                self.controller.show_frame("PageThree")
            

            # Thoát bằng cách nhấn phím 'q'
            if cv2.waitKey(1) & 0xFF == ord('q'):
                print("Exiting...")
                break

        self.stop_capture()

    def stop_capture(self):
        self.capturing = False
        if self.cap:
            self.cap.release()
        cv2.destroyAllWindows()

    def import_image(self):
        # Nhập ảnh và đọc mã QR
        file_path = filedialog.askopenfilename(title="Select an Image", filetypes=[("Image Files", "*.png;*.jpg;*.jpeg")])
        if file_path:
            img = cv2.imread(file_path)
            decoded_objects = decode(img)

            for obj in decoded_objects:
                qr_data = obj.data.decode("utf-8")
                print(f"QR Code detected: {qr_data}")
                self.controller.active_name = qr_data
                self.controller.frames["PageThree"].update_qr_data(qr_data)
                self.controller.show_frame("PageThree")
                return

            messagebox.showerror("ERROR", "No QR code found in the image.")

            
class PageThree(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)
        self.controller = controller
        self.qr_data = None
        self.numimglabel = tk.Label(self, text="Number of images captured = 0", font='Helvetica 12 bold', fg="#263942")
        self.numimglabel.grid(row=0, column=0, columnspan=2, sticky="ew", pady=10)

        self.capturebutton = tk.Button(self, text="Capture Data Set", fg="#ffffff", bg="#263942", command=self.start_capture)
        self.capturebutton.grid(row=1, column=0, ipadx=5, ipady=4, padx=10, pady=20)

        self.buttoncanc = tk.Button(self, text="Cancel", command=lambda: controller.show_frame("PageTwo"), bg="#ffffff", fg="#263942")
        self.buttoncanc.grid(row=2, column=0, padx=10, pady=10)

        # Khởi tạo các mô hình Dlib
        self.detector = dlib.get_frontal_face_detector()
        self.predictor = dlib.shape_predictor(shape_predictor_path)
        self.net = dlib.face_recognition_model_v1(face_recognition_model_path)
        self.num_of_images = 0
        self.is_capturing = False
    def update_qr_data(self, qr_data):
        self.qr_data = qr_data
    def start_capture(self):
        if self.is_capturing:
            messagebox.showinfo("INFO", "Capture is already in progress.")
            return
        
        self.num_of_images = 0
        self.is_capturing = True
        self.numimglabel.config(text="Capturing images...")

        self.vid = cv2.VideoCapture(0)
        self.start_camera_view()

    def start_camera_view(self):
        self.cap = cv2.VideoCapture(0)
        self.capturing = True
        start_time = time.time()

        while self.capturing:
            ret, frame = self.cap.read()
            if not ret:
                break

            # Vẽ khung căn chỉnh khuôn mặt (hình chữ nhật màu xanh lá)
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = self.detector(gray)
            for face in faces:
                # Vẽ hình chữ nhật quanh khuôn mặt
                top, right, bottom, left = face.top(), face.right(), face.bottom(), face.left()
                cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)

                # Kiểm tra xem đã qua 3 giây chưa và có khuôn mặt rõ ràng không
                if time.time() - start_time >= 2:
                    if self.is_face_clear(gray, face):
                        self.process_frame(frame)
                        self.capturing = False
                        break

            cv2.imshow("Align your face within the frame", frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        self.stop_capture()

    def is_face_clear(self, gray, face):
        # Cắt ảnh khuôn mặt
        face_img = gray[face.top():face.bottom(), face.left():face.right()]

        # Kiểm tra độ nét sử dụng Laplacian
        laplacian_var = cv2.Laplacian(face_img, cv2.CV_64F).var()
        threshold = 100  # Ngưỡng độ nét

        return laplacian_var > threshold

    def process_frame(self, frame):
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = self.detector(gray)

        if len(faces) == 1:
            face = faces[0]
            shape = self.predictor(gray, face)
            face_chip = dlib.get_face_chip(frame, shape)
            descriptor = self.net.compute_face_descriptor(face_chip)

            # Chuyển descriptor thành base64
            descriptor_bytes = np.array(descriptor).astype(np.float32).tobytes()
            base64_descriptor = base64.b64encode(descriptor_bytes).decode('utf-8')

            # Gửi dữ liệu đến API
            self.send_data_to_api(self.qr_data, base64_descriptor)

    def stop_capture(self):
        self.is_capturing = False
        self.capturing = False
        self.cap.release()
        cv2.destroyAllWindows()
    def send_data_to_api(self, qr_data, face_descriptor):
        url = "http://192.168.188.138:5000/biometric/positively"  # Thay đổi URL thành endpoint của bạn
        payload = {
            "faceData": face_descriptor,
            "dataQR": qr_data
        }

        try:
            # Bỏ qua xác thực SSL (chỉ nên sử dụng trong môi trường phát triển)
            response = requests.post(url, json=payload, verify=False)
            if response.status_code == 200:
                messagebox.showinfo("Success", response.text)
                self.controller.show_frame("PageThree")
            else:
                messagebox.showerror("Error",f"Failed to send data: {response.status_code} == Response: {response.text}")
        except requests.exceptions.RequestException as e:
            messagebox.showerror("Error", f"An error occurred: {e}")


class PageFour(tk.Frame):

    def __init__(self, parent, controller):
        tk.Frame.__init__(self, parent)
        self.controller = controller

        label = tk.Label(self, text="Face Recognition", font='Helvetica 16 bold')
        label.grid(row=0,column=0, sticky="ew")
        button1 = tk.Button(self, text="Face Recognition", command=self.openwebcam, fg="#ffffff", bg="#263942")
        #button2 = tk.Button(self, text="Emotion Detection", command=self.emot, fg="#ffffff", bg="#263942")
        #button3 = tk.Button(self, text="Gender and Age Prediction", command=self.gender_age_pred, fg="#ffffff", bg="#263942")
        button4 = tk.Button(self, text="Go to Home Page", command=lambda: self.controller.show_frame("StartPage"), bg="#ffffff", fg="#263942")
        button1.grid(row=1,column=0, sticky="ew", ipadx=5, ipady=4, padx=10, pady=10)
        #button2.grid(row=1,column=1, sticky="ew", ipadx=5, ipady=4, padx=10, pady=10)
        #button3.grid(row=2,column=0, sticky="ew", ipadx=5, ipady=4, padx=10, pady=10)
        button4.grid(row=1,column=1, sticky="ew", ipadx=5, ipady=4, padx=10, pady=10)

    def openwebcam(self):
        main_app(self.controller.active_name)
        
    '''
    def gender_age_pred(self):
       ageAndgender()
    def emot(self):
        emotion()
'''


app = MainUI()
app.iconphoto(True, tk.PhotoImage(file='icon.ico'))
app.mainloop()

