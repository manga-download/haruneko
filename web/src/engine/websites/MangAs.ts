import { Tags } from '../Tags';
import icon from './MangAs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';

const chapterScript = `
    new Promise((resolve, reject) => {
        const path = window.location.pathname +'/';
        resolve(jschaptertemp.map(chapter =>  { 
            return {
                id : path + chapter.slug,
                title : chapter.number + ' : ' + chapter.name.trim() 
            }}));
    });
`;

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('title').trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MangaReader.queryMangaTitle)
@Common.MangasMultiPageCSS('/filterList?page={page}&sortBy=name', 'div.media a.thumbnail', 1, 1, 500, MangaExtractor )
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageCSS(MangaReader.queryPages, MangaReader.ChapterPageExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangas', `MangAs`, 'https://mangas.in', Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

}
