import { Tags } from '../../Tags';
import icon from './ComicGardo.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as CoreView from '../decorators/CoreView';
import * as Common from '../decorators/Common';

@Common.MangaCSS(/^https?:\/\/comic-gardo\.com\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.MangasMultiPageCSS(['/series'])
@CoreView.ChaptersSinglePageCSS()
@CoreView.PagesSinglePageJSON()
@CoreView.ImageDescrambler()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicgardo', `コミックガルド (Comic Gardo)`, 'https://comic-gardo.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}