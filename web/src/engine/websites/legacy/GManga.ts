import { Tags } from '../../Tags';
import icon from './GManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as GManga from '../decorators/GManga';

const apiUrl = 'https://api.gmanga.me/';

@GManga.MangaCSS(/^https?:\/\/gmanga.me\/mangas\/\d+\/\S+$/)
@GManga.MangasMultiPageAJAX(apiUrl)
@GManga.ChaptersSinglePageAJAX(apiUrl)
@GManga.PagesSinglePageCSS()
@GManga.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gmanga', `GManga`, 'https://gmanga.me', Tags.Language.Arabic, Tags.Media.Manga, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }
}