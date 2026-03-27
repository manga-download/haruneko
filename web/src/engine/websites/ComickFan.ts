import { Tags } from '../Tags';
import icon from './ComickFan.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    data: T;
};

type APIChapter = {
    chapter: string;
    title: string;
    hash_id: string;
    group_names: string[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, '.bg-card-section.items-center > div:last-child')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid > a', Common.PatternLinkGenerator('/advanced-search?page={page}'), 0, anchor => ({
    id: anchor.pathname, title: anchor.querySelector('span.font-bold').textContent.trim()
}))
@Common.PagesSinglePageCSS('div.w-full img.mx-auto[loading*="lazy"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://comickfan.com/api/';

    public constructor() {
        super('comickfan', 'Comick Fanmade', 'https://comickfan.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIResult<APIChapter[]>>(new Request(new URL(`.${manga.Identifier.replace('/manga/', '/comics/')}/chapter-list?translation_group_id=`, this.apiUrl)));
        return data.map(({ chapter, title, hash_id: hash, group_names: group }) => new Chapter(this, manga, `${manga.Identifier}/chapter-${chapter}-${hash}`,
            [
                `Chapter ${chapter}`,
                title,
                `[${group[0]}]`
            ].filter(Boolean).join(' ').trim())
        ).distinct();
    }
}