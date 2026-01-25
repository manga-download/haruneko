import { Tags } from '../Tags';
import icon from './AnimeSama.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

function pageScript(chapterIndex: number) {
    return `new Array(dataOeuvre[${chapterIndex}]).fill(0).map((_, index) => 's2/scans/' + nomOeuvre + '/${chapterIndex}/' + (index+1) + '.jpg' )`;
}

@Common.MangaCSS(/^{origin}\/catalogue\/[^/]+\/$/, 'h4#titreOeuvre')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#list_catalog div.card-base a', Common.PatternLinkGenerator('/catalogue/?type[0]=Scans&search=&page={page}'), 0,
    anchor => ({
        id: anchor.pathname.endsWith('/') ? anchor.pathname : anchor.pathname + '/', //website search result sometimes misses trailing '/'
        title: anchor.querySelector<HTMLHeadingElement>('h2.card-title').textContent.trim()
    }))
@MangaStream.MangasSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('animesama', 'Anime-Sama', 'https://anime-sama.si', Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchWindowScript<{ id: string, title: string }[]>(new Request(new URL(`${manga.Identifier}scan/vf`, this.URI)), 'Object.keys(dataOeuvre).filter(key => parseInt(key)).map(key => ({id: key, title : "Chapitre " +key}))', 500);
        return data.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchWindowScript<string[]>(new Request(new URL(`${chapter.Parent.Identifier}scan/vf`, this.URI)), pageScript(parseInt(chapter.Identifier)), 500);
        return data.map(page => new Page(this, chapter, new URL(page, this.URI)));
    }
}