import { Tags } from '../Tags';
import icon from './MyAnimeListManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';
import { Exception } from '../Error';
import { WebsiteResourceKey as R } from '../../i18n/ILocale';

// TODO: Handle Novels (modified Publus reader?)

type ChaptersJSON = Array<{
    id: number;
    numbering_text: string;
    viewer_url: string;
    preview_url: string;
    is_previewable: boolean;
    is_free: boolean;
    is_possessed: boolean;
}>;

type ViewerJSON = {
    manuscript: {
        filenames: string[];
        image_base_url: string;
        query_params_part: string;
    },
};

type PageMode = {
    mode: string;
};

@Common.MangaCSS(/^{origin}\/store\/manga\/\d+\/[^/]+$/, 'h1.comic-detail-title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.items a.item', Common.PatternLinkGenerator('/store/search?p={page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLSpanElement>('span.title').textContent.trim() }))
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('myanimelistmanga', `MyAnimeList (Manga)`, 'https://myanimelist.net', Tags.Language.English, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [button] = await FetchCSS<HTMLDivElement>(new Request(new URL(manga.Identifier, this.URI)), 'div.v-manga-store-purchase-bulk-button');
        const chaptersData: ChaptersJSON = JSON.parse(button.dataset.items);
        return chaptersData.filter(({ is_free: free, is_possessed: owned, is_previewable: preview }) => preview || free || owned)
            .filter(({ viewer_url: viewerUrl }) => !viewerUrl.includes('novel_viewer'))
            .map(({ is_free: free, is_possessed: owned, numbering_text: name, preview_url: pUrl, viewer_url: vUrl }) => {
                const isPossessed = owned ?? false;
                const isFull = free || isPossessed;
                const title = [name.trim(), isFull ? '' : '[Preview]'].join(' ').trim();
                return new Chapter(this, manga, new URL(isFull ? vUrl : pUrl, this.URI).pathname, title);
            });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageMode>[]> {
        const [viewerElement] = await FetchCSS<HTMLDivElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.v-manga-store-viewer');
        if (!viewerElement) {
            throw new Exception(R.Plugin_Common_Chapter_UnavailableError);
        }
        const { manuscript: { filenames, image_base_url, query_params_part } }: ViewerJSON = JSON.parse(viewerElement.dataset.state);
        return filenames.map(file => {
            const uri = new URL(image_base_url + '/' + file);
            uri.search = query_params_part;
            return new Page<PageMode>(this, chapter, uri, { mode: 'xor' });
        });
    }

    public override async FetchImage(page: Page<PageMode>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        switch (page.Parameters.mode) {
            case 'xor': {
                return GetTypedData(this.XOR(await blob.arrayBuffer()));
            }
        }
    }

    private XOR(encrypted: ArrayBuffer): ArrayBuffer {
        const data = new Uint8Array(encrypted);
        const keySize = data[1];
        const key = data.slice(2, 2 + keySize);
        const decrypted = data.slice(2 + keySize);
        for (let index = 0; index < decrypted.length; index++) {
            decrypted[index] ^= key[index % key.length];
        }
        return decrypted.buffer;
    }
}