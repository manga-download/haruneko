import { Tags } from '../Tags';
import icon from './DigimonCard.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ClipStudioReader from './decorators/ClipStudioReader';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.querySelector<HTMLDivElement>('div.chapterListTitle').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/digimon_liberator\/(en|jp)\/comic\/$/, 'meta[name="Description"]')
@Common.ChaptersSinglePageCSS('section#chapters ul.chapterList li.chapterListBox > a:not(.closed)', ChapterExtractor)
@ClipStudioReader.PagesSinglePageAJAX()
@ClipStudioReader.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('digimoncard', 'DigimonCard', 'https://digimoncard.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Language.English, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            new Manga(this, provider, '/digimon_liberator/en/comic/', 'DIGIMON LIBERATOR', Tags.Language.English),
            new Manga(this, provider, '/digimon_liberator/jp/comic/', 'DIGIMON LIBERATOR', Tags.Language.Japanese),
        ];
    }
}