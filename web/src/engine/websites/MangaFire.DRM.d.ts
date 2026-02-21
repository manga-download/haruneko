type ImageLinks = [[string, never, number]];
export declare class DRMProvider {
    CreateImageLinks(chapterURL: URL): Promise<ImageLinks>;
    DescrambleImage(scramblingOffset: number, image: ImageBitmap, ctx: OffscreenCanvasRenderingContext2D): Promise<void>;
}
export {};
