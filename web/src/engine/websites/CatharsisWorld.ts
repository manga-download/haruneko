import icon from './CatharsisWorld.webp';
import { Tags } from '../Tags';
import { type Chapter, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';
import type { Priority } from '../taskpool/DeferredTask';
import { XOR } from '../Crypto';
import { RateLimit } from '../taskpool/RateLimit';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';
import { CatharsisDeScramble, CatharsisBase, type APIManga } from './templates/CatharsisBase';
import * as devalue from 'devalue';

const readerPassName = 'catharsis_reader_pass';

AddAntiScrapingDetection(async (invoke) => invoke(`
        new Promise((resolve) => {

            document.addEventListener('solve', async (event) => {
                setTimeout(() => window.location.reload(), 500);
                resolve(${FetchRedirection.Automatic});
                return;
            });

            if (document.querySelector('ion-icon')) {
                resolve(${FetchRedirection.Interactive});
                return;
            };


            resolve(${FetchRedirection.None});
        });
`), /^https:\/\/newcatharsis\.dig-it\.info\/manga\/[^/]+\/chapter\//);

type APIChapter = {
    id: number;
    titulo: string;
    numero: number;
    paginas: {
        index: number;
    }[];
    chapterSessionToken: string;
};

type PageData = {
    index: number;
    chapterSessionToken: string;
};

type TicketResponse = {
    signedToken: string;
    scrambleKey: string;
    xorByte: number;
};

export default class extends CatharsisBase {

    //private readonly apiURL = `${this.URI.origin}/api/`;
    //#authToken: string = undefined;
    //#readerToken: ReaderToken = undefined;

    public constructor() {
        super('catharsisworld', 'Catharsis World', 'https://newcatharsis.dig-it.info', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
        this.WithReaderPassName(readerPassName);
        this.WithWebsiteHeaders({
            'System': 'catharsis',
            'X-Fk-Sistema': '3',
        });
        this.imageTaskPool.RateLimit = new RateLimit(1, 2);
    }

    public override get Icon() {
        return icon;
    }

    /*
    public override async Initialize(): Promise<void> {
        this.#authToken = await FetchWindowScript(new Request(this.URI), `
            new Promise ( resolve => {
                cookieStore.set('catharsis_nsfw_agreed', 'true');
                const auth = localStorage.getItem('auth-storage');
                resolve ( auth ? JSON.parse(auth).state.token : undefined);
            });
        `, 500);
    }
    */
    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, nombre, slug } = await this.FetchAPI<APIManga>(`./mangas/${url.split('/').at(-1)}`);
        return new Manga(this, provider, `${id}/${slug}`, nombre);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const [mangaID, mangaSlug] = chapter.Parent.Identifier.split('/');
        const [chapterId, chapterNumber] = chapter.Identifier.split('/');

        const chapterURL = new URL(`/manga/${mangaSlug}/chapter/${chapterNumber}`, this.URI);

        //pass captcha + get validation cookie
        await FetchWindowScript(new Request(chapterURL), ``, 2500);

        /*
        //now that we have the cookie, we can fetch the chapter data
        const data = await FetchJSON(new Request(new URL(`${chapterURL.href}.data`), {
            headers: {
                Referer: chapterURL.href,
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin',
            }
        }));
        console.log(devalue.parse(JSON.stringify(data)));
        */

//        hook JSON.parse to get { p, n, r)}



        //https://newcatharsis.dig-it.info/api/mangas/chapters/105493/sync-session

        /*
        const { paginas, chapterSessionToken } = await this.FetchAPI<APIChapter>(`./mangas/${mangaID}/${chapterId}`, undefined, {
            'X-Catharsis-Reader-Pass': this.readerToken.pass
        });*/
        if (!paginas) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        return paginas.map(({ index }) => new Page<PageData>(this, chapter, new URL(this.URI), { index, chapterSessionToken }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const [chapterId] = page.Parent.Identifier.split('/');

        const { buffer, scrambleKey, xorByte } = await this.imageTaskPool.Add(async () => {

            //get page ticket https://newcatharsis.dig-it.info/api/mangas/chapters/chapterID/page-ticket
            const { scrambleKey, signedToken, xorByte } = await this.FetchAPI<TicketResponse>(`./mangas/chapters/${chapterId}/page-ticket`, {
                pageIndex: page.Parameters.index,
                sessionToken: page.Parameters.chapterSessionToken,
                q: 'hq',
                g: true
            });

            const buffer = (await Fetch(new Request(new URL(`./mangas/pages/${signedToken}`, this.apiURL), {
                headers: {
                    Referer: page.Parameters.Referer,
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'X-Catharsis-Reader': '1',
                },
            }))).arrayBuffer();
            return { buffer: await buffer, scrambleKey, xorByte };
        }, priority, signal);

        const blob = await Common.GetTypedData(XOR(new Uint8Array(buffer), new Uint8Array([xorByte])).buffer);

        return await CatharsisDeScramble(blob, scrambleKey);
    }
}