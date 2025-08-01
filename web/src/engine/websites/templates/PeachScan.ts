//Portuguese? template using JSZIP to extract chapter pages from zip files

import JSZip from 'jszip';
import { Fetch, FetchHTML } from '../../platform/FetchProvider';
import { Page, type Chapter, DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import type { Priority } from '../../taskpool/DeferredTask';

type PageKey = {
    key: string;
}

export function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLDivElement>('div.info__capitulo__obras span.numero__capitulo').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.desc__titulo__comic')
@Common.MangasSinglePagesCSS(['/todas-as-obras/'], 'div.comics__all__box a.titulo__comic__allcomics')
@Common.ChaptersSinglePageCSS('ul.capitulos__lista a.link__capitulos', ChapterExtractor)

export class PeachScan extends DecoratableMangaScraper {

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new Request(new URL(chapter.Identifier, this.URI));
        const doc = await FetchHTML(request);
        let files: string[] = [];

        //NOT using script because their anti-adblkock triggers a messagebox and screw up the process
        const filesZip = doc.documentElement.innerHTML.match(/const\s+urls\s*=\s*\[(.*?)]\s*;/)?.at(1);
        if (filesZip) {
            files = filesZip.split(',').map(element => element.replaceAll("'", '').trim());
        } else {
            files = [...doc.querySelectorAll<HTMLImageElement>('div#imageContainer img')].map(image => new URL(image.src, this.URI).href);
        }

        if (files.length == 0) return [];

        if (files.at(0).endsWith('.zip')) {
            const pages: Page[] = [];
            for (const zipurl of files) {
                const request = new Request(new URL(zipurl, this.URI), { cache: 'reload', headers: { Referer: this.URI.href } });
                const response = await Fetch(request);
                const zipfile = await JSZip.loadAsync(await response.arrayBuffer());
                const fileNames = Object.keys(zipfile.files)
                    .sort((a, b) => ExtractNumber(a) - ExtractNumber(b))
                    .filter(key => [/jpe?g$/i, /png$/i, /webp$/i, /avif$/i].some(pattern => pattern.test(key)))
                    .map(key => new Page<PageKey>(this, chapter, new URL(zipurl, this.URI), { key }));
                pages.push(...fileNames);
            }
            return pages;

        } else { //we have normal pictures links
            return files.map(file => new Page(this, chapter, new URL(file)));
        }
    }

    public override async FetchImage(page: Page<PageKey> | Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return !page.Link.href.endsWith('.zip') ? await Common.FetchImageAjax.call(this, page, priority, signal, true) : this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, { cache: 'force-cache', headers: { Referer: this.URI.href } }));
            const zip = await JSZip.loadAsync(await response.arrayBuffer());
            return Common.GetTypedData(await zip.files[(page as Page<PageKey>).Parameters.key].async('arraybuffer'));
        }, priority, signal);
    }
}

function ExtractNumber(fileName): number {
    return parseInt(fileName.split(".")[0]);
}