import { Tags } from '../Tags';
import icon from './ScyllaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ReaderFront from './decorators/ReaderFront';

const apiUrl = 'https://api.scyllascans.org';
const cdnUrl = apiUrl;

@ReaderFront.MangaAJAX(/^https?:\/\/scyllascans\.org\/work\/[a-z]{2}\/[^/]+/, apiUrl)
@ReaderFront.MangasSinglePageAJAX(apiUrl)
@ReaderFront.ChaptersSinglePageAJAX(apiUrl)
@ReaderFront.PagesSinglePageAJAX(apiUrl, cdnUrl)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scyllascans', `Scylla Scans`, 'https://scyllascans.org', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}