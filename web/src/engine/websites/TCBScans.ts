import { Tags } from '../Tags';
import icon from './TCBScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLDivElement>('div.text-lg').textContent.trim() + ' : ' + anchor.querySelector<HTMLDivElement>('div.text-gray-500').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/mangas\/\d+\/[^/]+$/, 'div.px-4.py-6 > h1')
@Common.MangasSinglePageCSS('/projects', 'div.justify-between > div.flex.flex-col > a')
@Common.ChaptersSinglePageCSS('div.col-span-2 > a.block.border.border-border', ChapterExtractor)
@Common.PagesSinglePageCSS('picture > img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tcbscans', `TCB Scans`, 'https://tcbscans.me', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}