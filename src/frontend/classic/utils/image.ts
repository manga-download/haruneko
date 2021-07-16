export const preloadImage = async (src: string, throttlingDelay: number): Promise<void> => {
    return new Promise<void>((res) => {
        setTimeout(() => {
            const img = new Image();
            img.src = src;
            res();
        }, throttlingDelay);
    });
}