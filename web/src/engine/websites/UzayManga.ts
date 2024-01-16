import { Tags } from '../Tags';
import icon from './UzayManga.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise((resolve, reject) => {
        __next_f.forEach(element => {
            const el = element[1];
            if (el) {
                if(el.includes('[{"path":'))  {
                    resolve(el)
                }
            }
        });
        reject();
    });
`;

type JSONPage = {
    path: string;
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.chapternum').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'div.content-details h1')
@Common.MangasMultiPageCSS('/?page={page}', 'div.overflow-hidden.grid.grid-cols-1 > div > a')
@Common.ChaptersSinglePageCSS('div.list-episode a', ChapterExtractor)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('uzaymanga', 'Uzay Manga', 'https://uzaymanga.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

        const request = new Request(new URL(chapter.Identifier, this.URI).href);
        const data = await FetchWindowScript<string>(request, pageScript);
        const jsonString = data.match(/(\[{"path":.*}\])}}/)[1];
        const imagesData: JSONPage[] = JSON.parse(jsonString);
        return imagesData.map(image => new Page(this, chapter, new URL(`https://cdn1.uzaymanga.com/series/image/${ image.path }`)));
    }

}