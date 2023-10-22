import type { Numeric, Text } from '../SettingsManager';
import { Key as GlobalKey } from '../SettingsGlobal';

type DrawingCallback = (source: ImageBitmap, target: OffscreenCanvasRenderingContext2D) => PromiseLike<void>;

export default async function DeScramble(scrambled: ImageBitmapSource, render: DrawingCallback): Promise<Blob | null> {
    const bitmap = await createImageBitmap(scrambled);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    await render(bitmap, canvas.getContext('2d'));

    const settings = HakuNeko.SettingsManager.OpenScope();
    const options = {
        type: settings.Get<Text>(GlobalKey.DescramblingFormat).Value,
        quality: settings.Get<Numeric>(GlobalKey.DescramblingQuality).Value / 100
    };
    return canvas.convertToBlob(options);
}