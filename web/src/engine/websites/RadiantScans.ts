import { Tags } from '../Tags';
import icon from './RadiantScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@MangaStream.MangaCSS(/^{origin}\/series\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/series/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('radiantscans', 'Radiant Scans', 'https://radiantscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        try {
            return await MangaStream.FetchPagesSinglePageJS.call(this, chapter, [], 'ts_reader.params.sources.shift().images', 500);
        } catch {
            const nodes = await FetchCSS<HTMLDivElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div#readerarea div[style*="background-image"]');
            return nodes.map(page => new Page(this, chapter, new URL(page.style.backgroundImage.match(/["'](http(s)?:\/\/[^'"]+)/)[1])));
        }
    }

}