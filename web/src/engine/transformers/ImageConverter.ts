type ImageType = 'image/png' | 'image/jpeg' | 'image/webp';

export async function ConvertBitmap(bitmap: ImageBitmap, type: ImageType = 'image/png', quality = 1.0): Promise<Blob> {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext('bitmaprenderer');
    context.transferFromImageBitmap(bitmap);
    return canvas.convertToBlob({ type, quality });
}

export async function ConvertImage(source: ImageBitmapSource, type: ImageType = 'image/png', quality = 1.0): Promise<Blob> {
    const bitmap = await createImageBitmap(source);
    try {
        return ConvertBitmap(bitmap, type, quality);
    } finally {
        bitmap.close();
    }
}