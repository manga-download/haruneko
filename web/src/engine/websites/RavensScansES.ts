import { Tags } from '../Tags';
import icon from './RavensScansES.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ReaderFront from './decorators/ReaderFront';

const apiUrl = 'https://api.ravens-scans.com';
const cdnUrl = 'https://img-cdn1.ravens-scans.com';

@ReaderFront.MangaAJAX(/^https?:\/\/ravens-scans\.com\/work\/es\/[^/]+/, apiUrl)
@ReaderFront.MangasSinglePageAJAX(apiUrl, ['es'])
@ReaderFront.ChaptersSinglePageAJAX(apiUrl)
@ReaderFront.PagesSinglePageAJAX(apiUrl, cdnUrl)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('ravensscans-es', `RavensScans (Spanish)`, 'https://ravens-scans.com', Tags.Language.Spanish, Tags.Source.Scanlator, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}