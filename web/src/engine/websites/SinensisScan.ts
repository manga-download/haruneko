import { Tags } from '../Tags';
import icon from './SinensisScan.webp';
import type { Priority } from '../taskpool/TaskPool';
import { Fetch, FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import JSZip from 'jszip';

// TODO: Add novel support

function ChapterInfoExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector<HTMLSpanElement>('span.numero__capitulo').innerText.trim(),
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.desc__titulo__comic')
@Common.MangasSinglePageCSS('/todas-as-obras/', 'section.todas__as__obras a.titulo__comic__allcomics')
@Common.ChaptersSinglePageCSS('ul.capitulos__lista a.link__capitulos', ChapterInfoExtractor)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sinensisscan', 'Sinensis Scans', 'https://sinensistoon.com', Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        // TODO, FIXME: A alert in hidden electron-window forces the window to be shown => disable any kind of popups in electron
        const zipURL = await FetchWindowScript<string>(new Request(new URL(chapter.Identifier, this.URI)), `urls.filter(url => url.endsWith('.zip')).at(0)`);
        const zipURI = new URL(zipURL, this.URI);
        const response = await Fetch(new Request(zipURI, { cache: 'reload' }));
        const zip = await JSZip.loadAsync(await response.arrayBuffer());
        return Object.keys(zip.files)
            .filter(key => [ /jpe?g$/i, /png$/i, /webp$/i, /avif$/i ].some(pattern => pattern.test(key)))
            .map(key => new Page(this, chapter, zipURI, { key }));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, { cache: 'force-cache' }));
            const zip = await JSZip.loadAsync(await response.arrayBuffer());
            return Common.GetTypedData(await zip.files[page.Parameters['key'] as string].async('arraybuffer'));
        }, priority, signal);
    }
}