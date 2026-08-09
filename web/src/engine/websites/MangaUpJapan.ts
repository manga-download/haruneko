import { Tags } from '../Tags';
import icon from './MangaUpJapan.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS } from '../platform/FetchProvider';

type HydratedChapters = {
    chapters: {
        id: number;
        name: string;
        subName: string;
    }[]
};

type HydratedPages = {
    pages: {
        content: { value: { imageUrl?: string } }
    }[]
};

const endpoints = [
    'mon',
    'tue',
    'wed',
    'thu',
    'fri',
    'sat',
    'sun',
    'end',
    'yomikiri'
].map(slug => `/series/${slug}`);

@Common.MangaCSS(/^{origin}\/titles\/\d+$/, 'h2[class*="text-title-lg"]')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a:has(div[class*="text-title-md"])', Common.StaticLinkGenerator(...endpoints), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLDivElement>('div[class*="text-title-md"]').innerText
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaupjapan', 'MangaUp (マンガアップ!)', 'https://www.manga-up.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon(): string {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters.map(({ id, name, subName }) => new Chapter(this, manga, `${manga.Identifier}/chapters/${id}`, `${subName} ${name}`.replace(/\s+/g, ' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchNextJS<HydratedPages>(new Request(new URL(chapter.Identifier, this.URI)), data => 'pages' in data);
        return pages
            .filter(page => page.content.value.imageUrl)
            .map(page => new Page(this, chapter, new URL(page.content.value.imageUrl, this.URI)));
    }
}