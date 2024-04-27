import { Tags } from '../Tags';
import icon from './ModeScanlator.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import * as JSZip from 'jszip';
import type { Priority } from '../taskpool/TaskPool';

const pagescript = `
    new Promise((resolve, reject) => {
        try {
            resolve(urls);
        } catch (error) {
            const pages = [...document.querySelectorAll('div#imageContainer img')].map(image=> new URL(image.src, window.location.origin).href);
            resolve(pages);
        }
    });
`;

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('div.info__capitulo__obras span.numero__capitulo').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.desc__titulo__comic')
@Common.MangasSinglePageCSS('/todas-as-obras/', 'div.comics__all__box a.titulo__comic__allcomics')
@Common.ChaptersSinglePageCSS('ul.capitulos__lista a.link__capitulos', ChapterExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('modescanlator', `Mode Scanlator`, 'https://modescanlator.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator), Tags.Accessibility.RegionLocked;
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        let request = new Request(new URL(chapter.Identifier, this.URI).href);
        const files: string[] = await FetchWindowScript(request, pagescript);
        if (files.length > 0 && files[0].endsWith('.zip')) {
            const pages : Page[]= [];
            for (const zipurl of files) {
                request = new Request(new URL(zipurl, this.URI).href);
                const response = await Fetch(request);
                const zipdata = await response.arrayBuffer();
                const zipfile = await JSZip.loadAsync(zipdata);
                Object.keys(zipfile.files)
                    .filter(file => !file.endsWith('.svg'))
                    .sort((self, other) => parseInt(self) - parseInt(other))
                    .forEach(file => pages.push(new Page(this, chapter, new URL(zipurl, this.URI), { filename: file })));
            }
            return pages;
        } else {
            return files.map(file => new Page(this, chapter, new URL(file)));
        }
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        if (page.Link.href.endsWith('.zip')) {
            const request = new Request(new URL(page.Link, this.URI).href);
            const response = await Fetch(request);
            const zipdata = await response.arrayBuffer();
            const zipfile = await JSZip.loadAsync(zipdata);
            const zipEntry = zipfile.files[page.Parameters['filename'] as string];
            const imagebuffer = await zipEntry.async('nodebuffer');
            return Common.GetTypedData(imagebuffer);
        } else return Common.FetchImageAjax.call(this, page, priority, signal);
    }
}