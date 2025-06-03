using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using OpenCvSharp;
using DlibDotNet;

namespace Biometrics.ApiService.Infra.Common
{
    public static class DlibExtensions
    {
        public static DlibDotNet.Matrix<RgbPixel> ToDlibMatrix(this Mat image)
        {
            if (image.Channels() != 3)
            {
                throw new InvalidOperationException("Image must be in BGR format.");
            }

            var matrix = new DlibDotNet.Matrix<RgbPixel>(image.Rows, image.Cols);

            for (int y = 0; y < image.Rows; y++)
            {
                for (int x = 0; x < image.Cols; x++)
                {
                    var color = image.At<Vec3b>(y, x);
                    matrix[y, x] = new RgbPixel
                    {
                        Red = color.Item2,
                        Green = color.Item1,
                        Blue = color.Item0
                    };
                }
            }

            return matrix;
        }
    }
}
