import { Tags } from '../Tags';
import icon from './Futabanet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('.m-result-list__title').textContent.trim();
    return { id, title };
}
function ChapterExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector<HTMLSpanElement>('span:not(.new)').innerText.replace(/\(\d+\.\d+(.*)\)$/, '').trim();
    const id = anchor.href;
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/gaugau\.futabanet\.jp\/list\/work\/\S+$/, 'h1.detail-ex__title')
@Common.MangasMultiPageCSS('/list/works?page={page}', 'div.m-result-list__item a', 1, 1, 0, MangaExtractor)
@Common.ChaptersSinglePageCSS('section.detail-sec.detail-ex div.detail-ex__btn-item a[href*="reader.futabanet"]', ChapterExtractor)
@SpeedBinb.PagesSinglePage('https://reader.futabanet.jp')
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('futabanet', `がうがうモンスター (Futabanet Monster)`, 'https://gaugau.futabanet.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }
}