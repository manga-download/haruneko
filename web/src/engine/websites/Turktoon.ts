import { Tags } from '../Tags';
import icon from './Turktoon.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { Page, type Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { ZeistManga } from './templates/ZeistManga';
import PageScript from './templates/ZeistManga.page-script.js?raw';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'h1.entry-title')
export default class extends ZeistManga {

    public constructor() {
        super('turktoon', 'Turktoon', 'https://www.turktoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
        this.WithMangaSlugScript('document.querySelector("div#bookmarkData").dataset.path;');
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages : string[]= await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), PageScript, 2500);
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }
}