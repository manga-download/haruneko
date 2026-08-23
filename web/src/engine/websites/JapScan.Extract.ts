import { FetchWindowScript } from '../platform/FetchProvider';

/**
 * Scrolls a visible JapScan reader to trigger lazy-loading, then collects
 * every image URL whose host is the JapScan image CDN (c*.japscan.foo).
 *
 * Returns a deduplicated list of image URLs suitable for Page construction.
 */
export async function ExtractPagesFromReader(referer: string): Promise<string[]> {
    const script = `
        (() => {
            const IMG_RE = /.(jpe?g|png|webp|gif|avif|bmp|tiff?)(?:[?#]|$)/i;
            const isCDN = u => typeof u === 'string' && u.length > 0 && u.indexOf('.japscan.foo') !== -1 && u.indexOf('www.japscan.foo') === -1 && IMG_RE.test(u);
            const seen = new Set();
            const collect = () => {
                try {
                    document.querySelectorAll('img').forEach(img => {
                        [img.currentSrc, img.src, img.getAttribute('data-src'), img.getAttribute('data-original'), img.getAttribute('data-lazy-src')].forEach(u => {
                            if (isCDN(u)) seen.add(u);
                        });
                    });
                } catch (e) {}
                try {
                    performance.getEntriesByType('resource').forEach(entry => {
                        if (entry && isCDN(entry.name) && (!entry.initiatorType || entry.initiatorType === 'img' || entry.initiatorType === 'fetch' || entry.initiatorType === 'xmlhttprequest')) seen.add(entry.name);
                    });
                } catch (e) {}
            };
            collect();
            return new Promise(resolve => {
                let steps = 0;
                const step = () => {
                    collect();
                    try { window.scrollBy(0, window.innerHeight || 800); } catch (e) {}
                    const atBottom = (window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 30);
                    if (atBottom || ++steps >= 80) {
                        collect();
                        resolve(Array.from(seen));
                    } else {
                        setTimeout(step, 250);
                    }
                };
                setTimeout(step, 300);
            });
        })()
    `;
    try {
        const pages = await FetchWindowScript<string[]>(new Request(referer), script, 1000, 150000, true);
        return (pages ?? []).filter((link, index, all) => all.indexOf(link) === index);
    } catch {
        return [];
    }
}
