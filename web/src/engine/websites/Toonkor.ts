import { Tags } from '../Tags';
import icon from './Toonkor.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.dataset.role,
        title: element.textContent.trim()
    };
}

const pageScript = `
    new Promise (resolve => {
        const dom =  new DOMParser().parseFromString(toon_img, 'text/html');
        resolve([...dom.querySelectorAll('img')].map(img => new URL(img.src, window.location.origin).href));
    })
`;

@Common.MangaCSS(/https:\/\/toonkor\d+\.com\/[^/]+$/, 'table.bt_view1 td.bt_title')
@Common.MangasSinglePagesCSS([ '/웹툰/연재?fil=제목', '/웹툰/완결?fil=제목'], 'div.section-item-title a#title')
@Common.ChaptersSinglePageCSS('td.content__title', ChapterExtractor)
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonkor', `Toonkor`, 'https://toonkor468.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const response = await fetch('https://itset.co/link/webtoon/toonkor');
        this.URI.href = new URL(response.url).origin;
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }

}