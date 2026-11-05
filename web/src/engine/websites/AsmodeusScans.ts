import { Tags } from '../Tags';
import icon from './AsmodeusScans.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

// TODO : Novel Support

@Common.MangaCSS<HTMLScriptElement>(/^{origin}\/[^/]+$/, 'script#series-offline-data', (script, uri) => ({
    id: uri.pathname,
    title: (<{ seriesTitle: string }>JSON.parse(script.text)).seriesTitle
}))
@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('div#chapters-list a')].map(anchor=> ({ id: anchor.pathname, title: anchor.dataset.chLabel}) );`, 500)
@Common.PagesSinglePageCSS('div#strip-reader div.reader-page-ph img')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asmodeusscans', 'Asmodeus Scans', 'https://asmotoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Novel, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run;) {
                const { html, has_more: more } = await FetchJSON<{ html: string, has_more: boolean }>(new Request(new URL(`/?_ajax=search&offset=${offset}`, this.URI)));
                const doc = new DOMParser().parseFromString(html, 'text/html');
                const mangas = [...doc.querySelectorAll<HTMLAnchorElement>('a')].map(anchor => {
                    return new Manga(this, provider, anchor.pathname, anchor.querySelector('div h2.font-bold.text-white').textContent.trim());
                });
                offset += mangas.length;
                yield* mangas;
                run = more;
            }
        }.call(this));
    }
}