import { Tags } from '../Tags';
import icon from './BarManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2('span.chapter-link-inner', (element) => ({ id: new URL(element.dataset.href).pathname, title: element.textContent.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('barmanga', 'BarManga', 'https://libribar.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const regex = /var\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*'([0-9a-fA-F]+)'/g;
        const scripts = (await FetchCSS<HTMLScriptElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.reading-content script:not([src])'))
            .filter(script => script.text.indexOf('hexToString') > 0);
        return scripts.map(script => {
            let match = undefined;
            let finalUrl = '';

            while ((match = regex.exec(script.text)) !== null) {
                finalUrl += match[2];
            }
            return new Page(this, chapter, new URL(String.fromCharCode(...finalUrl.match(/.{1,2}/g).map(e => parseInt(e, 16)))));
        });

    }
}