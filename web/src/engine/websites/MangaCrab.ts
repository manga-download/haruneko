import { Tags } from '../Tags';
import icon from './MangaCrab.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';

const chapterScript = `
    [ ...document.querySelectorAll('li.wp-manga-chapter div.parm-extras > a') ].map(element => ({
        id: element.pathname,
        title : element.text.trim(),
    }));
`;

type PageKey = {
    imgKey: string;
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'h1.post-title')
@Common.MangasMultiPageCSS('div.post-title h2 > a', Common.PatternLinkGenerator('/page/{page}/?s&post_type=wp-manga'))
@Common.ChaptersSinglePageJS(chapterScript, 750)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacrab', 'Manga Crab', 'https://mangacrab.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageKey>[]> {
        //NOT using script because of ad wall intermediate page interfering
        const [body] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), 'body');
        const images = [...body.querySelectorAll('div.page-break img.wp-manga-chapter-img[id^="image-"]')]
            .map(img => [...img.attributes].find(attribute => attribute.value.startsWith('/encript.php'))?.value)
            .filter(img => img);
        const imgKey = body.innerHTML.match(/Img-X'\s*:\s*'(.*)'/).at(1);
        return images.map(page => new Page<PageKey>(this, chapter, new URL(page, this.URI), { imgKey }));
    }

    public override async FetchImage(page: Page<PageKey>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            return (await Fetch(new Request(page.Link, {
                headers: {
                    Referer: new URL(page.Parent.Identifier, this.URI).href,
                    'Img-X': page.Parameters.imgKey
                },
            }))).blob();
        }, priority, signal);
    }
}
