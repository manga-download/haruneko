import { Tags } from '../Tags';
import icon from './AesirScans.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { Page, type Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { ZeistManga } from './templates/ZeistManga';
import PageScript from './templates/ZeistManga.page-script.js?raw';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'h1[itemprop="name"]')
export default class extends ZeistManga {

    public constructor() {
        super('aesirscans', 'Aesir Scans', 'https://www.aesirscans.site', Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
        this.WithMangaSlugScript(`encodeURIComponent(document.querySelector('#chapterlist').dataset.label.replace(/[',]/g, ''));`);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages: string[] = await FetchWindowScript(new Request(new URL(chapter.Identifier, this.URI)), PageScript, 2500);
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }
}