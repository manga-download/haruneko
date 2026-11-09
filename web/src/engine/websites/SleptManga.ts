import { Tags } from '../Tags';
import icon from './SleptManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS, FetchJSON } from '../platform/FetchProvider';

type HydratedChapters = {
    chapters: {
        number: number;
    }[];
};

type APIPages = {
    images: {
        url: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/man(hw|hu|g)a\/[^/]+$/, 'meta[property="og:image:alt"]')
@Common.MangasMultiPageCSS('div.panel-card div.grid h3 a:not([href*="/novel/"])', Common.PatternLinkGenerator('/browse?page={page}'))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('sleptmanga', 'Slept Manga', 'https://sleptmanga.com.tr', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters
            .sort((self, other) => other.number - self.number)
            .map(({ number }) => new Chapter(this, manga, `${manga.Identifier.split('/').at(-1)}/${number}`, `Bölüm ${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchJSON<APIPages>(new Request(new URL(`./chapters/${chapter.Identifier}/images`, this.apiURL), {
            headers: {
                'X-Api-Key': 'slept-flutter-xK9mP2wQ7vL4nJ8hB3cF6dR1',
                'X-App-Version': '1.0.5'
            }
        }));
        return images.map(({ url }) => new Page(this, chapter, new URL(url, this.URI), { Referer: this.URI.href }));
    }
}