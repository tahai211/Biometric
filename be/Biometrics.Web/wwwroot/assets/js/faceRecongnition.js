//let video = null;
//let canvas = null;
//let context = null;
//let streaming = false;

//let width = 100;    // We will scale the photo width to this.
//let height = 0;     // This will be computed based on the input stream
//let filter = 'sepia(1)';

//async function onStart(options) {
//    video = document.getElementById(options.videoID);
//    canvas = document.getElementById(options.canvasID);
//    context = canvas.getContext('2d');
//    width = options.width;
//    filter = options.filter;

//    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//        .then(function (stream) {
//            video.srcObject = stream;
//            video.play();
//        })
//        .catch(function (err) {
//            console.log("An error occurred: " + err);
//        });

//    video.addEventListener('canplay', function () {
//        if (!streaming) {
//            height = video.videoHeight / (video.videoWidth / width);

//            if (isNaN(height)) {
//                height = width / (4 / 3);
//            }

//            video.setAttribute('width', width);
//            video.setAttribute('height', height);
//            canvas.setAttribute('width', width);
//            canvas.setAttribute('height', height);
//            streaming = true;
//        }
//    }, false);

//    video.addEventListener("play", function () {
//        console.log('play');
//        timercallback();
//    }, false);
//}

//async function timercallback() {
//    if (video.paused || video.ended) {
//        return;
//    }
//    setTimeout(function () {
//        timercallback();
//    }, 100);  // Adjust the timeout for the desired frame rate
//}

////async function computeFrame() {
////    context.drawImage(video, 0, 0, width, height);
////    context.filter = filter;

////    // You can handle the frame or send it to a backend if needed
////    const dataUrl = canvas.toDataURL('image/png');
////    console.log("Frame captured:", dataUrl);
////}
//async function takePhoto() {
//    if (!video || video.paused || video.ended) return;

//    context.drawImage(video, 0, 0, width, height);
//    context.filter = filter;

//    const dataUrl = canvas.toDataURL('image/png');
//    console.log(dataUrl);
//    // Gửi chuỗi base64 đến Blazor để xử lý
//    const base64Element = document.getElementById('base64Image');
//    if (base64Element) {
//        base64Element.textContent = dataUrl;  // Cập nhật nội dung của phần tử
//    }

//    // Hoặc lưu vào biến toàn cục
//    window.base64Image = dataUrl;
//}
//async function computeFrame() {
//    context.drawImage(video, 0, 0, width, height);  // Chụp khung hình từ video
//    context.filter = filter;  // Áp dụng bộ lọc

//    // Chuyển đổi khung hình thành chuỗi base64
//    const dataUrl = canvas.toDataURL('image/png');

//    // Lưu chuỗi base64 vào một phần tử DOM để Blazor có thể truy cập
//    console.log(dataUrl);
//    const base64Element = document.getElementById('base64Image');
//    if (base64Element) {
//        base64Element.textContent = dataUrl;  // Cập nhật nội dung của phần tử
//    }

//    // Hoặc lưu vào biến toàn cục
//    window.base64Image = dataUrl;
//}

//window.WebCamFunctions = {
//    start: (options) => { onStart(options); },
//    takePhoto: () => { takePhoto(); }
//};
//window.getBase64Image = () => {
//    const base64Element = document.getElementById('base64Image');
//    return base64Element ? base64Element.textContent : '';
//};


window.loadFaceApiModels = async (dotnetHelper) => {
    console.log("hágduahsjd")
    await faceapi.nets.ssdMobilenetv1.loadFromUri('/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    dotnetHelper.invokeMethodAsync('SetFaceScanResult', 'ModelsLoaded');
};

window.startFaceScan = async (dotnetHelper) => {
    const video = document.getElementById('videoElement');

    // Lấy quyền truy cập vào camera
    navigator.mediaDevices.getUserMedia({ video: {} }).then(stream => {
        video.srcObject = stream;
    });

    const labeledFaceDescriptors = await loadLabeledImages();

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    video.addEventListener('play', async () => {
        const canvas = faceapi.createCanvasFromMedia(video);
        document.body.append(canvas);
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        const interval = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video)
                .withFaceLandmarks().withFaceDescriptors();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            const results = resizedDetections.map(d => faceMatcher.findBestMatch(d.descriptor));

            if (results.some(res => res.label !== 'unknown')) {
                dotnetHelper.invokeMethodAsync('SetFaceScanResult', 'SUCCESS');
                clearInterval(interval);
            } else {
                dotnetHelper.invokeMethodAsync('SetFaceScanResult', 'FAILED');
            }

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }, 100);
    });
};

async function loadLabeledImages() {
    const labels = ['Person1', 'Person2']; // Thay đổi với dữ liệu người dùng thực tế
    return Promise.all(
        labels.map(async label => {
            const descriptions = [];
            for (let i = 1; i <= 1; i++) {
                const img = await faceapi.fetchImage(`/images/${label}/${i}.jpg`);
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
                descriptions.push(detections.descriptor);
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );
}
