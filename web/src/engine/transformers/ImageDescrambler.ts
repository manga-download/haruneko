import type { Numeric, Text } from '../SettingsManager';
import { Key as GlobalKey } from '../SettingsGlobal';

type DrawingCallback = (source: ImageBitmap, target: OffscreenCanvasRenderingContext2D) => PromiseLike<void>;

export default async function DeScramble(scrambled: ImageBitmapSource, draw: DrawingCallback): Promise<Blob | null> {
    const bitmap = await createImageBitmap(scrambled);
    try {
        const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        await draw(bitmap, canvas.getContext('2d'));

        const settings = HakuNeko.SettingsManager.OpenScope();
        const options = {
            type: settings.Get<Text>(GlobalKey.DescramblingFormat).Value,
            quality: settings.Get<Numeric>(GlobalKey.DescramblingQuality).Value / 100
        };
        return canvas.convertToBlob(options);
    } finally {
        bitmap.close();
    }
}