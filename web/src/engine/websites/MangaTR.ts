import { Tags } from '../Tags';
import icon from './MangaTR.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.title === 'Bot Koruması' && document.querySelector('canvas#sliderCanvas') != undefined`);
    return result ? FetchRedirection.Interactive : undefined;
});

@Common.MangaCSS<HTMLImageElement>(FlatManga.pathManga, 'img.thumbnail', (img, uri) => ({ id: uri.pathname, title: img.title.trim() }))
@Common.MangasSinglePageCSS('/manga-list.html', 'div.container a[data-toggle="mangapop"]:not([data-original-title=""])')
@Common.PagesSinglePageJS(`
    new Promise(resolve => {
        const xorKey = (
            document.querySelector('#chapter-images').dataset.k1 +
            window.imageQueueData.k2
        ).split('').map(c => c.charCodeAt(0));

        const data = imageQueueData.queue
            .filter(el => Array.isArray(el))
            .map(el => atob(el.join('')));

        const xorWithKey = (str, key) => {
            const out = [];
            const len = key.length;
            for (let i = 0; i < str.length; i++) {
                out.push(String.fromCharCode(str.charCodeAt(i) ^ key[i % len]));
            }
        return out.join('');
      };
      resolve(data.map(str => xorWithKey(str, xorKey)));
    });
`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatr', 'Manga-TR', 'https://manga-tr.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('read_type', '1')`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return FlatManga.FetchChaptersAJAX.call(this, manga, '/cek/fetch_pages_manga.php?manga_cek={manga}', 'div.chapter-item div.chapter-title > a');
    }
}