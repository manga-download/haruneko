import { Tags } from '../Tags';
import icon from './OtakuAngel.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';
import { FetchRegex } from '../platform/FetchProvider';

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]', (meta, uri) => ({
    id: uri.pathname,
    title: meta.content.split('-').slice(0, -1).join('').trim()
}))
@Common.MangasMultiPageCSS('div.grid a[role="button"]', Common.PatternLinkGenerator('/kesfet?sayfa={page}'))
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('div.no-scrollbar a[data-sveltekit-preload-data]:has(h3)')].map(a => ({ id : a.pathname, title : a.textContent.trim()}));`, 1500)
@Grouple.ImageWithMirrors()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('otakuangel', 'Otaku Angel', 'https://otakuangel.com', Tags.Media.Manga, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Grouple.MirroredPage[]> {
        const CDNS = ['https://angel.cdnotakuangel.com/', 'https://otaku.cdnotakuangel.com/'];
        const [images] = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /imageUrls\s*:\s*(\[[^\]]+\])/g);
        return (<string[]>JSON.parse(images)).map(image => new Page(this, chapter, new URL(`${CDNS[0]}${image}`), { Mirrors: [`${CDNS[1]}${image}`] }));
    }
}