import icon from './CatharsisWorld.webp';
import { Tags } from '../Tags';
import { type Chapter, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchNextJS, FetchHTML } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { XOR } from '../Crypto';
import { AddAntiScrapingDetection } from '../platform/AntiScrapingDetection';
import { GetBytesFromUTF8, GetURLBase64FromBytes } from '../BufferEncoder';
import { CatharsisDeScramble, CaptchaScript, CatharsisBase, type APIChapter } from './templates/CatharsisBase';

const readerPassName = 'aedex_reader_pass';

AddAntiScrapingDetection(async invoke => invoke(CaptchaScript(readerPassName))
    , /^https:\/\/aedexnox\.com\/comic\/[^/]+\/\d+/);

type HydratedManga = {
    info: {
        id: number;
        nombre: string;
        slug: string;
        capitulos: APIChapter[];
    };
};

type GateAnswer = {
    //in case websocket validation is required
    ws_required?: boolean;
    ws_url?: string;
    ws_ticket?: string;

    //wait_seconds?: number;

    //redirection (ie POST redirect_data to redirect_url )
    redirect_required?: boolean;
    redirect_url?: string;
    redirect_data?: string;

    //pages are directly available (either via computing, either via paginas array)
    chapterSessionToken?: string;
    totalPaginas?: number;
    //paginas?: PageData[]; ??????
};

type WebSocketMessage = {
    type: 'countdown' | 'ready';
    remainingSeconds?: number;
    totalSeconds?: number;
    challenge?: string;
    redirect_url?: string;
    redirect_data?: string;
};

type WebSocketValidationResult = {
    redirect_url: string;
    redirect_data: string;
};

type PageData = {
    index: number;
    scrambleKey?: string;
    chapterSessionToken?: string;
};

export class ECCManager {
    private keyPairPromise: Promise<CryptoKeyPair>;

    constructor() {
        this.keyPairPromise = crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
    }

    public async GetPubKey(): Promise<string> {
        const { publicKey } = await this.keyPairPromise;
        const exportedKey = await crypto.subtle.exportKey("spki", publicKey);
        return GetURLBase64FromBytes(new Uint8Array(exportedKey));
    }

    public async Sign(message: string): Promise<string> {
        const { privateKey } = await this.keyPairPromise;

        const buffer = GetBytesFromUTF8(message);
        const signature = await crypto.subtle.sign({ name: "ECDSA", hash: { name: "SHA-256" } }, privateKey, buffer);
        return GetURLBase64FromBytes(new Uint8Array(signature));
    }
}

export default class extends CatharsisBase {

    //private readonly apiURL = `${this.URI.origin}/api/backend/`;
    //#authToken: string = undefined;
    //#readerToken: ReaderToken = undefined;

    public constructor() {
        super('aedex', 'Aedex', 'https://aedexnox.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
        this.WithReaderPassName(readerPassName);
        this.WithAPIUrl(`${this.URI.origin}/api/backend/`);
        this.WithMangaPath(`/comic/`);
        this.WithWebsiteHeaders({
            'System': 'aedex',
            'X-Fk-Sistema': '1',
        });

        //this.imageTaskPool.RateLimit = new RateLimit(1, 2);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { info: { id, nombre, slug } } = await FetchNextJS<HydratedManga>(new Request(new URL(url)), data => 'info' in data);
        return new Manga(this, provider, `${id}/${slug}`, nombre);
    }

    /*
    private async RenewReaderToken(chapter: Chapter): Promise<void> {
        const [, mangaSlug] = chapter.Parent.Identifier.split('/');
        const [, chapterNumber] = chapter.Identifier.split('/');

        if (!this.#readerToken || this.#readerToken.expiresAt < Date.now()) {
            this.#readerToken = await FetchWindowScript<ReaderToken>(new Request(new URL(`/comic/${mangaSlug}/${chapterNumber}?modo=gratis`, this.URI)), `JSON.parse(sessionStorage.getItem('aedex_reader_pass'));`, 2500);
        }
    }*/

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const [, mangaSlug] = chapter.Parent.Identifier.split('/');
        const [, chapterNumber] = chapter.Identifier.split('/');

        const chapterURL = new URL(`/comic/${mangaSlug}/${chapterNumber}?modo=gratis`, this.URI);
        await this.RenewReaderToken(chapterURL.href);

        const signer = new ECCManager();
        const gateAnswer = await this.FetchAPI<GateAnswer>(`./mangas/${mangaSlug}/${chapterNumber}?modo=gratis`, undefined, {
            'X-Catharsis-Reader-Pass': this.readerToken.pass,
            'X-Catharsis-WS-Pub': await signer.GetPubKey()
        });

        //TODO : handle direct pages
        const { chapterSessionToken } = gateAnswer;
        if (chapterSessionToken) return [];

        //HANDLE Websocket validation
        const { ws_required: wsRequired, ws_url: wsUrl, ws_ticket: wsTicket } = gateAnswer;
        let { redirect_url: redirectUrl, redirect_data: redirectData } = gateAnswer;

        if (wsRequired && wsUrl && wsTicket) {
            const answer = await this.WebSocketValidation(wsUrl, wsTicket, signer);
            redirectUrl = answer?.redirect_url;
            redirectData = answer?.redirect_data;
        };

        //Redirection
        const formData = new FormData();
        formData.append('data', redirectData);

        const realUrl = new URL(redirectUrl);
        const html = await FetchHTML(new Request(realUrl, {
            method: 'POST',
            body: formData
        }));

        //Extract pages from HTML
        const elements = [...html.querySelectorAll<HTMLCanvasElement>('canvas.manga-page-canvas')];
        return elements.map(({ dataset }, index) => new Page<PageData>(this, chapter, new URL(dataset.src), { Referer: realUrl.href, index, scrambleKey: dataset.k }));
    }

    private async WebSocketValidation(wsUrl: string, wsTicket: string, signer: ECCManager): Promise<WebSocketValidationResult> {
        return new Promise(async (resolve, reject) => {
            const WS = new WebSocket(`${wsUrl}?ticket=${wsTicket}`);
            try {
                WS.onerror = (error) => {
                    WS.close();
                    reject(error);
                };
                WS.onmessage = async (event: MessageEvent<WebSocketMessage>) => {
                    const { type, remainingSeconds, challenge, redirect_url: redirectUrl, redirect_data: redirectData } = <WebSocketMessage>JSON.parse(String(event.data));

                    switch (type) {
                        case 'countdown': {
                            console.log(`WebSocket countdown: ${remainingSeconds} seconds remaining.`);
                            const sig = await signer.Sign(challenge);
                            WS.readyState === WebSocket.OPEN && WS.send(JSON.stringify({ type: 'ack', challenge, sig }));
                            break;
                        };
                        case 'ready': {
                            console.log(`READY`);
                            WS.close();
                            resolve({ redirect_url: redirectUrl, redirect_data: redirectData });
                        };

                    }
                };
            } catch (error) {
                WS.close();
                reject(error);
            }
        });
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const decryptPicture = (buffer: ArrayBuffer, key: number) => Common.GetTypedData(XOR(new Uint8Array(buffer), new Uint8Array([key])).buffer);

        const buffer = await this.imageTaskPool.Add(async () => {
            return (await Fetch(new Request(page.Link, {
                headers: {
                    Referer: page.Parameters.Referer,
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                },
            }))).arrayBuffer();
        }, priority, signal);

        //Decrypt image if needed, with either key 175 or key 43
        let blob = await Common.GetTypedData(buffer);
        if (!blob.type.startsWith('image/')) blob = await decryptPicture(buffer, 175);
        if (!blob.type.startsWith('image/')) blob = await decryptPicture(buffer, 43);

        return await CatharsisDeScramble(blob, page.Parameters.scrambleKey);
    }

}