import { cacheStorageKey } from "./storage";

export const preloadImage = async (src: string, throttlingDelay: number): Promise<void> => {
    const response = await caches.match(src)

    if (!response) {
        return new Promise<void>((res) => {

            setTimeout(async () => {
                const img = new Image();
                img.src = src;

                const cache = await caches.open(cacheStorageKey)
                cache.add(src);
                res();
            }, throttlingDelay);
        });
    }
}