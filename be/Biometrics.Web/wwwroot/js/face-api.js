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
