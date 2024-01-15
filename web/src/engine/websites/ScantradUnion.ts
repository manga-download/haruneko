import { Tags } from '../Tags';
import icon from './ScantradUnion.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterInfoExtractor(element: HTMLDivElement) {
    const number = element.querySelector<HTMLSpanElement>('span.chapter-number').innerText.trim();
    let title = element.querySelector<HTMLSpanElement>('span.chapter-name').innerText.trim();
    title = title.length ? ' - ' + title : title;
    title = (number + title).trim();
    const id = element.querySelector<HTMLAnchorElement>('div.buttons a.btnlel:not([onclick])').pathname;
    return { id, title };
}

const pageScript = `
    if(window.obj) {
        obj.images.map(page => [obj.site_url, obj.all_manga_dir, obj.title + '_' + page.manga_id, 'ch_' + page.chapter_number, page.image_name].join('/'));
    } else {
       [...document.querySelectorAll('div.current-image img.manga-image')].map(img => img.src);
    }
`;

@Common.MangaCSS(/^{origin}\/manga\//, 'div.projet-description > h2')
@Common.MangasMultiPageCSS('/manga/page/{page}/', 'main article div.entry-post > h2 > a')
@Common.ChaptersSinglePageCSS('div.name-chapter', ChapterInfoExtractor)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scantradunion', `Scantrad Union`, 'https://scantrad-union.com', Tags.Language.French, Tags.Source.Scanlator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}