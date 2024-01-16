import { Tags } from '../Tags';
import icon from './DemoneCeleste.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[^/]+\//, 'div.col-md-8.text-center h3 strong')
@Common.MangasSinglePageCSS('/manga/', 'div#myTabContent h4 > a')
@Common.ChaptersSinglePageCSS('div.col-md-8.text-center > div a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('demoneceleste', `Demone Celeste`, 'https://www.demoneceleste.it', Tags.Language.Italian, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const target = chapter.Identifier.match(/.*\/(.*)\/(\d+).*$/);
        const request = new Request(new URL('/ajax.php', this.URI).href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'x-referer': this.URI.href },
            body: new URLSearchParams({ ajax: 'pagine', id: target[1], n: target[2], leggo: "1" }).toString()
        });
        const data = await FetchCSS<HTMLElement>(request, 'pag');
        return data.map(element => new Page(this, chapter, new URL(element.textContent.trim(), this.URI)));
    }
}
