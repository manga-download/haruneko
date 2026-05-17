import { Tags } from '../Tags';
import icon from './MangaTV.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a.dload').pathname,
        title: [...element.querySelectorAll('.chapternum')].map(({ textContent }) => textContent.trim()).join(' ').trim()
    };
};

@MangaStream.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/)
@Common.MangasMultiPageCSS('div.listupd div.bsx a', Common.PatternLinkGenerator('/lista?page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapterlist ul li div.chbox', undefined, ChapterExtractor)
@Common.PagesSinglePageJS(`ts_reader_control.getImages().map(image => image.replace('//', 'https://'));`, 750)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatv', 'MangaTV', 'https://mangatv.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}