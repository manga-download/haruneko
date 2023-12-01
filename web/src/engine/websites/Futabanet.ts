import { Tags } from '../Tags';
import icon from './Futabanet.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS, FetchRequest } from '../FetchProvider';

@Common.MangaCSS(/^{origin}\/list\/work\/[^/]+$/, 'div.works__grid div.list__text div.mbOff h1')
@Common.MangasMultiPageCSS('/list/works?page={page}', 'div.works__grid div.list__box h4 a')
@SpeedBinb.PagesSinglePage()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('futabanet', `がうがうモンスター (Futabanet Monster)`, 'https://gaugau.futabanet.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(`${this.URI.origin}${manga.Identifier}/episodes`);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'div.episode__grid a');
        return data.map(chapter => {
            const epnum = chapter.querySelector('.episode__num').textContent.trim();
            const title = chapter.querySelector('.episode__title').textContent.trim();
            return new Chapter(this, manga, chapter.pathname, title ? [epnum, title].join(' - ') : epnum);
        });

    }

}