import { Tags } from '../Tags';
import icon from './RavenSeries.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIPages = {
    response: {
        pages: {
            urlImg: string;
        };
    };
};

@Common.MangaCSS(/^{origin}\/sr2\/[^/]+$/, 'title', (title, uri) => ({
    id: uri.pathname,
    title: title.innerText.split('|').at(0).trim(),
}))
@Common.MangasMultiPageCSS('div#projectsDiv figure div a', Common.PatternLinkGenerator('/comics?page={page}'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('section#section-list-cap div.grid a.group', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLDivElement>('div#name').innerText.trim()
}))
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ravenseries', 'RavenSeries', 'https://ravensword.lat', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaSlug = chapter.Parent.Identifier.split('/').at(-1);
        const chapterSlug = chapter.Identifier.split('/').at(-1);
        const { response: { pages: { urlImg } } } = await FetchJSON<APIPages>(new Request(new URL(`/api/fake/${mangaSlug}/${chapterSlug}`, this.URI)));
        return (JSON.parse(urlImg) as string[]).map(page => new Page(this, chapter, new URL(page)));
    }
}