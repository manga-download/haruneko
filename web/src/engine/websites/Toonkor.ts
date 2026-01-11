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
    private readonly hostRegexp = /https?:\/\/(?:toonkor|tkor)([\d]+)?\.[a-z]+/;

    public constructor() {
        super('toonkor', `Toonkor`, 'https://tkor086.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.URI.href = await FetchWindowScript<string>(new Request(new URL('https://t.me/s/toonkor_com')), `
            new Promise(resolve => {
                //fetch telegram messages with links, reverse it because last one is more recent one, and get the first matching our regex
                const tkLinks = [...document.querySelectorAll('section.tgme_channel_history div.tgme_widget_message_wrap .tgme_widget_message_text a ')].reverse();
                for (const link of tkLinks) {
                    if ( ${this.hostRegexp}.test(link.href)) {
                        resolve(link.href);
                        break;
                    }
                }
            });
        `, 500);;
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
    }
}