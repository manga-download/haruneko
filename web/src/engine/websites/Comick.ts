import { Tags } from '../Tags';
import icon from './Comick.webp';
import { Delay } from '../BackgroundTimers';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    data: {
        hid: string;
        chap: string;
        title: string;
        lang: string;
        group_name: string[];
    }[];
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/comic\/[^/]+$/, 'a[href*="/cover"] img', (img, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: img.alt.trim()
}))
@Common.MangasNotSupported() // The rate-limit is to high to get the whole list before the CloudFlare cookie expires
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://comick.live/api/';

    public constructor() {
        super('comick', 'Comick (.live)', 'https://comick.live', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator, ...Tags.Rating.toArray());
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/search', this.URI)), '');
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                await Delay(500);
                const { data } = await FetchJSON<APIChapters>(new Request(new URL(`./comics/${manga.Identifier}/chapter-list?page=${page}`, this.apiURL)));
                const chapters = data.map(({ chap, hid, title, lang, group_name: groups }) => {
                    title = ['Ch.', chap, title, `[${groups.join(' ').trim()}]`].joinTitleSegments();
                    return new Chapter(this, manga, `/comic/${manga.Identifier}/${hid}-chapter-${chap}-${lang}`, title);
                });
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [{ text }] = await FetchCSS<HTMLScriptElement>(new Request(new URL(chapter.Identifier, this.URI)), 'script#sv-data');
        return (<{ url: string }[]>JSON.parse(text).chapter.images).map(({ url }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href }));
    }
}