import { Tags } from '../Tags';
import icon from './RaijinScans.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

type ReaderManifest = {
    ajaxUrl: string;
    chapterId: number;
    chapterSlug: string;
    delay: number;
    host: string;
    imageClass: string;
    instance: string;
    limit: number;
    mangaId: number;
    nonce: string;
    offset: number;
    token: string;
};

type APIPages = {
    data: {
        images: {
            url: string;
        }[];
    };
};

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.serie-info h1.serie-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raijinscans', 'RaijinScans', 'https://raijin-scans.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('manga/-/', this.URI)), '');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const manifests = await FetchWindowScript<ReaderManifest[]>(new Request(new URL(chapter.Identifier, this.URI)), `window.raijinFreeReaderManifests`, 500);
        manifests.sort((self, other) => self.offset - other.offset);

        const pages = await manifests.reduce<Promise<Page[]>>(async (accP, manifest) => {
            const acc = await accP;

            const { ajaxUrl, chapterId, nonce, token, mangaId, chapterSlug, host, offset, limit } = manifest;
            const body = new FormData();
            body.append('action', 'raijin_free_reader_manifest');
            body.append('nonce', nonce);
            body.append('token', token);
            body.append('manga_id', `${mangaId}`);
            body.append('chapter_id', `${chapterId}`);
            body.append('chapter_slug', chapterSlug);
            body.append('host', host);
            body.append('offset', `${offset || 0}`);
            body.append('limit', `${limit || 0}`);

            const { data: { images } } = await FetchJSON<APIPages>(new Request(new URL(ajaxUrl), {
                credentials: 'same-origin',
                method: 'POST',
                body
            }));

            return [...acc, ...images.map(({ url }) => new Page(this, chapter, new URL(url)))];
        }, Promise.resolve([]));
        return pages;
    }
}