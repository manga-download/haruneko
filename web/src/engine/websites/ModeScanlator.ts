import { Tags } from '../Tags';
import icon from './ModeScanlator.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchRequest, FetchWindowScript } from '../FetchProvider';
import * as JSZip from 'jszip';

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

@Common.MangaCSS(/^https?:\/\/modescanlator\.com\/[^/]+\/$/, 'h1.desc__titulo__comic')
@Common.MangasSinglePageCSS('/todas-as-obras/', 'div.comics__all__box a.titulo__comic__allcomics')
@Common.ChaptersSinglePageCSS('ul.capitulos__lista a.link__capitulos', ChapterExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('modescanlator', `Mode Scanlator`, 'https://modescanlator.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //1st : first fetch zip files urls
        let request = new FetchRequest(new URL(chapter.Identifier, this.URI).href);
        const files: string[] = await FetchWindowScript(request, pagescript);
        if (files.length == 0) return [];

        //if files are zip
        if (files[0].endsWith('.zip')) {
            //handle zip files
            const pages : Page[]= [];
            for (const zipurl of files) {
                request = new FetchRequest(new URL(zipurl, this.URI).href);
                const response = await Fetch(request);
                const zipdata = await response.arrayBuffer();
                const zipfile = await JSZip.loadAsync(zipdata);
                const fileNames = Object.keys(zipfile.files).sort((a, b) => this.extractNumber(a) - this.extractNumber(b));

                for (const fileName of fileNames) {
                    const zipEntry = zipfile.files[fileName];
                    const imagebuffer = await zipEntry.async('nodebuffer');
                    let data = imagebuffer.toString('base64');
                    if (zipEntry.name.match(/\.(avif)$/i)) {
                        data = 'data:image/avif;base64,' + data;
                        pages.push(new Page(this, chapter, new URL(data)));
                    }
                }
            }
            return pages;

        } else { //we have normal pictures links
            return files.map(file => new Page(this, chapter, new URL(file)));
        }

    }

    extractNumber(fileName) : number {
        return parseInt(fileName.split(".")[0]);
    }

}