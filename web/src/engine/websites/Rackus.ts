import { Tags } from '../Tags';
import icon from './Rackus.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([/(00-FL-creds|Z-END-CREDITS)(-\d+)?\.webp$/ ], 'ts_reader.params.sources.shift().images')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('rackus', 'Rackus', 'https://rackusreads.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}