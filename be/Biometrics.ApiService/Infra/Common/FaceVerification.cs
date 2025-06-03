using DlibDotNet;
using OpenCvSharp;
using System;
using System.Collections.Generic;
using System.Drawing.Imaging;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using System.Drawing.Imaging;
using System.Text;


namespace Biometrics.ApiService.Infra.Common
{
    public class FaceVerification
    {
        //private static FrontalFaceDetector _detector;
        //private static ShapePredictor _predictor;
        //private static DlibDotNet.FaceRecognitionModel _faceRecognitionModel;

        //static FaceVerification()
        //{
        //    // Khởi tạo các mô hình nhận diện khuôn mặt
        //    _detector = Dlib.GetFrontalFaceDetector();
        //    _predictor = ShapePredictor.Deserialize("shape_predictor_68_face_landmarks.dat");
        //    _faceRecognitionModel = DlibDotNet.FaceRecognitionModel.Deserialize("dlib_face_recognition_resnet_model_v1.dat");
        //}

        //// Chuyển đổi Base64 thành Bitmap
        //private static Bitmap Base64ToBitmap(string base64String)
        //{
        //    var imageBytes = Convert.FromBase64String(base64String);
        //    using var ms = new MemoryStream(imageBytes);
        //    return new Bitmap(ms);
        //}

        //// Chuyển đổi Bitmap thành Mat của OpenCV
        //private static Mat BitmapToMat(Bitmap bitmap)
        //{
        //    var mat = new Mat(bitmap.Height, bitmap.Width, DepthType.Cv8U, 3);
        //    using var bitmapStream = new MemoryStream();
        //    bitmap.Save(bitmapStream, ImageFormat.Bmp);
        //    bitmapStream.Seek(0, SeekOrigin.Begin);
        //    var bitmapMat = Mat.FromStream(bitmapStream, ImreadModes.Color);
        //    bitmapMat.CopyTo(mat);
        //    return mat;
        //}

        //// Lấy đặc trưng khuôn mặt từ Base64
        //public static async Task<float[]> GetFaceDescriptorFromBase64Async(string base64Image)
        //{
        //    var bitmap = Base64ToBitmap(base64Image);
        //    var mat = BitmapToMat(bitmap);

        //    // Chuyển đổi Mat thành Image<Rgb, Byte> để xử lý với Dlib
        //    var emguImage = mat.ToImage<Rgb, byte>();
        //    var dlibImage = Dlib.LoadImage<RgbPixel>(emguImage.ToBitmap());

        //    // Lấy đặc trưng khuôn mặt
        //    return GetFaceDescriptor(dlibImage);
        //}

        //private static float[] GetFaceDescriptor(Matrix<Rgb, Byte> image)
        //{
        //    var faceRects = _detector.Operator(image);
        //    if (faceRects.Length == 0) return null;

        //    var shape = _predictor.Detect(image, faceRects[0]);
        //    var faceDescriptor = _faceRecognitionModel.ComputeFaceDescriptor(image, faceRects[0]);
        //    return faceDescriptor.ToArray();
        //}

        //// So sánh hai khuôn mặt từ base64
        //public static async Task<bool> CompareFacesAsync(string base64Image1, string base64Image2, double threshold)
        //{
        //    var faceDescriptor1 = await GetFaceDescriptorFromBase64Async(base64Image1);
        //    var faceDescriptor2 = await GetFaceDescriptorFromBase64Async(base64Image2);

        //    if (faceDescriptor1 == null || faceDescriptor2 == null) return false;

        //    var distance = CalculateEuclideanDistance(faceDescriptor1, faceDescriptor2);
        //    return distance < threshold;
        //}

        //// Tính khoảng cách Euclidean
        //public static double CalculateEuclideanDistance(float[] faceDescriptor1, float[] faceDescriptor2)
        //{
        //    double sum = 0;
        //    for (int i = 0; i < faceDescriptor1.Length; i++)
        //    {
        //        double diff = faceDescriptor1[i] - faceDescriptor2[i];
        //        sum += diff * diff;
        //    }
        //    return Math.Sqrt(sum);
        //}
    }
}
