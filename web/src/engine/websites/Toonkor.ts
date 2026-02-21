import { Tags } from '../Tags';
import icon from './Toonkor.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise (resolve => {
        const dom =  new DOMParser().parseFromString(toon_img, 'text/html');
        resolve([...dom.querySelectorAll('img')].map(img => new URL(img.src, window.location.origin).href));
    })
`;

@Common.MangaCSS(/https:\/\/(toonkor|tkor)\d+\.com\/[^/]+$/, 'table.bt_view1 td.bt_title')
@Common.MangasMultiPageCSS('div.section-item-title a#title', Common.StaticLinkGenerator('/웹툰/연재?fil=제목', '/웹툰/완결?fil=제목'))
@Common.ChaptersSinglePageCSS('td.content__title', undefined, element => ({ id: element.dataset.role, title: element.textContent.trim() }))
@Common.PagesSinglePageJS(pageScript, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonkor', `Toonkor`, 'https://tkor097.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(new URL('https://t.me/s/toonkor_com')), `
            document.querySelector([
                'div.tgme_widget_message_wrap:last-of-type a[href^="https://toonkor"]',
                'div.tgme_widget_message_wrap:last-of-type a[href^="https://tkor"]',
            ].join(', '))?.href;
        `, 500) ?? this.URI.href;
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}