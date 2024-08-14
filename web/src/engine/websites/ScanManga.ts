import { Tags } from '../Tags';
import icon from './ScanManga.webp';
import { DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch } from '../platform/FetchProvider';

const pagescript = `
    new Promise( async (resolve, reject) => {
        try {
            const response = await fetch("/api/lel/" + idc + '.json', {
                method: 'POST',
                credentials: 'omit',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'source': window.location.href,
                    'Token': 'sm'
                },
                body: JSON.stringify({
                    a: sme,
                    b: sml
                })
            });

            const result = await response.text();
            const _CHAPTERDATA = JSON.parse(atob(result.replace(new RegExp(idc.toString(16) + '$'), '').split('').reverse().join('')));
            const _HOST = _CHAPTERDATA.dN;
            const _FOLDER = "/" + _CHAPTERDATA.s + '/' + _CHAPTERDATA.v + '/' + _CHAPTERDATA.c + '';
            const _BASEURL = "https://" + _HOST + '' + _FOLDER + '';
            const _IMGLIST = Object.keys(_CHAPTERDATA.p).map(_ITEM => {
                const _page = _CHAPTERDATA.p[_ITEM];
                let _path_ = _BASEURL;
                const _extension = _page.e;
                const finalpath = "/" + encodeURIComponent(_page.f) + '.' + _extension + '';
                _path_ += finalpath;
                return _path_;
            });
            resolve(_IMGLIST);
        } catch (error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/\d+\/[^.]+\.html$/, 'div.h2_titre h2')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageCSS('div.contenu_volume_manga ul li.chapitre div.chapitre_nom a')
@Common.PagesSinglePageJS(pagescript, 500)

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('scanmanga', `ScanManga`, 'https://www.scan-manga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const request = new Request(page.Link, {
                credentials: 'omit',
                signal: signal,
                referrerPolicy: 'unsafe-url',
                mode: 'cors',
                headers: {
                    Referer: new URL(page.Parent.Identifier, this.URI).href,
                    Origin: this.URI.origin,
                    Accept: '*/*',
                    'Sec-Fetch-Site': 'cross-site'
                }
            });
            const response = await Fetch(request);
            return await response.blob();
        }, priority, signal);
    }
}