import { Tags } from '../../Tags';
import icon from './RavensScansEN.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as ReaderFront from '../decorators/ReaderFront';

const apiUrl = 'https://api.ravens-scans.com';
const cdnUrl = 'https://img-cdn1.ravens-scans.com';

@ReaderFront.MangaAJAX(/^https?:\/\/ravens-scans\.com\/work\/[a-z]{2}\/[^/]+/, apiUrl)
@ReaderFront.MangasSinglePageAJAX(apiUrl)
@ReaderFront.ChaptersSinglePageAJAX(apiUrl)
@ReaderFront.PagesSinglePageAJAX(apiUrl, cdnUrl)
@Common.ImageAjax(true)

export default class extends DecoratableMangaScraper {
    //TODO : Delete RavenscansES and change ids to ravensscans, because we fetch EN and ES content
    public constructor() {
        super('ravensscans-en', `RavensScans`, 'https://ravens-scans.com', Tags.Language.Multilingual, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}