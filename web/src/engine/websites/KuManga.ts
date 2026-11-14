import { Tags } from '../Tags';
import icon from './KuManga.webp';
import * as Common from './decorators/Common';
import { DecoratableMangaScraper, Page, type Chapter } from '../providers/MangaPlugin';
import { FetchWindowScript } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'h1.media-name__main', Common.WebsiteInfoExtractor({ queryBloat: 'small,div,span' }))
@Common.MangasNotSupported()
@Common.ChaptersSinglePageJS(`
        [
        ... [ ...document.querySelectorAll('a.media-chapter__link') ].map(chapter => ({
            id : chapter.pathname,
            title: chapter.innerText.trim(),
        })),
        ... OTHER_CHAPTERS.map(chapter => ({
            id : '/manga/'+ UMconfig.id+ '/capitulo/'+ chapter.NumCap,
            title: ['Capítulo', chapter.NumCap, (chapter.title ?? '')].join(' ').trim(),
        })),
    ];
`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kumanga', 'KuManga', 'https://www.kumanga.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //trigger Cloudflare at initialization
        return await FetchWindowScript(new Request(new URL('/mangalist?page=1', this.URI)), '');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const redirect = await FetchWindowScript<string>(new Request(new URL(chapter.Identifier, this.URI)), 'location.href', 1500);
        const pages = await FetchWindowScript<string[]>(new Request(redirect.replace('/c/', '/leer/')), `
            imageGallery().images.map(page => new URL(page, window.location.origin).href);
        `, 2500);
        return pages.map(page => new Page(this, chapter, new URL(page), { Referer: this.URI.href}));
    }
}