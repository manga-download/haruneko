import { Tags } from '../../Tags';
import icon from './Penlab.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../../providers/MangaPlugin';
import { FetchJSON, FetchRequest, FetchWindowScript } from '../../FetchProvider';
import * as Common from '../decorators/Common';

let apiUrl = 'https://x5i7-qk19-xc7o.s2.xano.io/api:hI9i4Ljs';

const scriptApiUrl = `
    new Promise((resolve, reject)=> {
        const collectionGetters = Object.values(wwLib.$store.getters['data/getCollections']);
        const goodgetter = collectionGetters.find(e => {
            return e.config.endpoint.path == '/comic';
        });
        resolve(goodgetter.config.apiGroupUrl);
   });
`;

type APIManga = {
    id: number,
    title: string,
    is_paid: boolean,
    is_locked: boolean,
    slug: string
}

type APIChapter = {
    id: number,
    episode_title: string,
    episode_number: string,
    is_accessible: boolean,
    require_login: boolean,
    canView: boolean,
    nonUserCanView: boolean
}

type APIPage = {
    id: number,
    ucarecdn_graphic_link: string
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('penlab', `Penlab`, 'http://penlab.ink', Tags.Language.English, Tags.Media.Comic, Tags.Source.Official);
    }

    public override async Initialize(): Promise<void> {
        //TODO : This should NOT cause "wwLib is undefined". Check why (even 10 seconds delay is not enough wtf)
        try {
            const request = new FetchRequest(new URL('/genres', this.URI).href);
            apiUrl = await FetchWindowScript<string>(request, scriptApiUrl, 2500);
        } catch {
            //
        }
        return;
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const request = new FetchRequest(apiUrl+'/comic');//dont use URL !
        const data = await FetchJSON<APIManga[]>(request);
        return data.map(manga => new Manga(this, provider, String(manga.id), manga.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(`${apiUrl}/chapter?comic_id=${manga.Identifier}`);
        const data = await FetchJSON<APIChapter[]>(request);
        return data.map(chap => new Chapter(this, manga, String(chap.id), chap.episode_title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(`${apiUrl}/episode?episode_id=${chapter.Identifier}`);
        const data = await FetchJSON<APIPage[]>(request);
        return data.map(page => new Page(this, chapter, new URL(page.ucarecdn_graphic_link)));
    }
}