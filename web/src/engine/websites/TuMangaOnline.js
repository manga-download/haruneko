var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Tags } from '../Tags';
import icon from './TuMangaOnline.webp';
import { FetchCSS } from '../platform/FetchProvider';
import { DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
function ChapterInfoExtractor(element) {
    const row = element.closest('li.list-group-item');
    const language = row?.querySelector('i.flag-icon')?.className?.match(/flag-icon-([a-z]+)/)?.pop()?.trim();
    const scanlator = row?.querySelector('a[href*="/groups/"]')?.innerText?.trim();
    const title = row?.closest('li.upload-link')?.querySelector('h4')?.innerText.trim();
    return {
        id: element.pathname,
        title: [
            title,
            scanlator ? `[${scanlator}]` : undefined,
            language ? `(${language})` : undefined,
        ].filter(entry => entry).join(' '),
    };
}
let default_1 = class extends DecoratableMangaScraper {
    constructor() {
        super('tumangaonline', `TuMangaOnline`, 'https://zonatmo.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Language.English, Tags.Source.Aggregator);
    }
    get Icon() {
        return icon;
    }
    async FetchPages(chapter) {
        const baseURL = this.URI.origin;
        const proxyRequest = new Request(new URL(chapter.Identifier, baseURL), {
            headers: { 'Referer': baseURL }
        });
        const response = await fetch(proxyRequest);
        const data = await response.text();
        const uid = response.redirected ? response.url.split('/').slice(-2, -1) : data.match(/uniqid\s*:\s*['"]([0-9a-f]+)['"]/)?.pop();
        const viewerRequest = new Request(new URL(`/viewer/${uid}/cascade`, baseURL), {
            headers: { 'Referer': proxyRequest.url }
        });
        const images = await FetchCSS(viewerRequest, 'img.viewer-img, img.viewer-image');
        return images.map((image) => {
            return new Page(this, chapter, new URL(image.dataset.src || image.src), { Referer: viewerRequest.url });
        });
    }
};
default_1 = __decorate([
    Common.MangaCSS(/^{origin}\/library\/[^/]+\/\d+\/[^/]+$/, 'section.element-header-content h2.element-subtitle'),
    Common.MangasNotSupported(),
    Common.ChaptersSinglePageCSS('ul.chapter-list a[href*="/view_uploads/"]', ChapterInfoExtractor),
    Common.ImageAjax()
], default_1);
export default default_1;
