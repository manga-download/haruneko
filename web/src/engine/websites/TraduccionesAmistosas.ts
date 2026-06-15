import { Tags } from '../Tags';
import icon from './TraduccionesAmistosas.webp';
import { FetchHTML } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/comics\/[^/]+$/, 'title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.comic-card', Common.PatternLinkGenerator('/library?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLImageElement>('img.card-media').alt.trim()
}))
@Common.PagesSinglePageCSS<HTMLImageElement>('div.page-wrap img.page-img', img => img.dataset.fbWp || img.dataset.src || img.src)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('traduccionesamistosas', 'Traducciones Amistosas', 'https://rncalation.online', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const dom = await FetchHTML(new Request(new URL(manga.Identifier, this.URI)));
        return [
            ...dom.querySelectorAll<HTMLAnchorElement>('div.chapter-list > a'),
            ...dom.querySelector<HTMLTemplateElement>('template#chapters-extra').content.querySelectorAll('a'),
        ].map(anchor => {
            const title = anchor.querySelector('span').innerText.replace(manga.Title, '').trim() || manga.Title;
            return new Chapter(this, manga, new URL(anchor.href, this.URI).pathname, title);
        });
    }
}