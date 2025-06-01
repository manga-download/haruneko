import { Tags } from '../Tags';
import icon from './GodaComic.webp';
import { DecoratableMangaScraper, type Manga, Chapter } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { chapterScript, type ChapterID } from './GodaManhua';

/*
const script = `
    fetch('/manga/get?mode=all&mid=' + document.querySelector('div[data-mid]').dataset.mid).then(response => response.text()).then(test => {
        document.body.innerHTML = text;
        return [ ...document.querySelectorAll('.chapteritem > a') ].map(element => ({ id: element.pathname, title: element.dataset.ct }));
    });
`;
*/

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav ol li:last-of-type a')
@Common.MangasMultiPageCSS('/manga/page/{page}', 'div.cardlist a')
@Common.PagesSinglePageCSS('div#chapcontent img[data-src]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('godacomic', 'GodaComic', 'https://manhuascans.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier.replace('/manga/', '/chapterlist/'), this.URI));
        const chapters = await FetchWindowScript<{ id: string, title: string }[]>(request, chapterScript, 2000);
        return chapters.map(chapter => {
            const { mangaid, id } = JSON.parse(chapter.id) as ChapterID;
            return new Chapter(this, manga, `./chapter/getcontent?m=${mangaid}&c=${id}`, chapter.title.replace(manga.Title, '').trim() || chapter.title);
        });
    }
}