/**
 * Image preprocessing utilities for OMR detection
 */

/**
 * Converts image data to grayscale
 * @param imgData - ImageData object from canvas
 * @returns Processed ImageData
 */
export const convertToGrayscale = (imgData: ImageData): ImageData => {
  const data = imgData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // R
    data[i + 1] = avg; // G
    data[i + 2] = avg; // B
    // Alpha remains unchanged
  }
  
  return imgData;
};

/**
 * Applies adaptive thresholding to isolate dark regions
 * @param imgData - ImageData object from canvas
 * @param threshold - Threshold value (0-255)
 * @returns Processed ImageData
 */
export const applyThreshold = (imgData: ImageData, threshold: number = 150): ImageData => {
  const data = imgData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    // If pixel is darker than threshold, make it black (0), otherwise white (255)
    const value = data[i] < threshold ? 0 : 255;
    data[i] = data[i + 1] = data[i + 2] = value;
  }
  
  return imgData;
};

/**
 * Loads an image from URL into a canvas and returns the image data
 */
export const loadImageData = (imageUrl: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageUrl;
  });
};

/**
 * Processes an image for OMR detection
 */
export const preprocessImage = async (imageUrl: string): Promise<{
  processedImageUrl: string;
  width: number;
  height: number;
}> => {
  try {
    // Load image data
    const imageData = await loadImageData(imageUrl);
    
    // Convert to grayscale
    const grayscale = convertToGrayscale(imageData);
    
    // Apply threshold
    const thresholded = applyThreshold(grayscale);
    
    // Create canvas for output
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    
    // Put processed image data back to canvas
    ctx.putImageData(thresholded, 0, 0);
    
    // Convert canvas to data URL
    const processedImageUrl = canvas.toDataURL('image/png');
    
    return {
      processedImageUrl,
      width: imageData.width,
      height: imageData.height
    };
  } catch (error) {
    console.error('Error preprocessing image:', error);
    throw error;
  }
};
