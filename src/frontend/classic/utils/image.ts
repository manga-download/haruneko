const key = 'c90a56611f1a6d7b586cc38e0b9c10cf';

export const preloadImage = async (src: string, throttlingDelay: number): Promise<void> => {
    const response = await caches.match(src);

    if (!response) {
        return new Promise<void>((res) => {

            setTimeout(async () => {
                const img = new Image();
                img.src = src;

                const cache = await caches.open(key);
                cache.add(src);
                res();
            }, throttlingDelay);
        });
    }
};
