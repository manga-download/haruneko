import { Tags } from '../Tags';
import icon from './MangaPlanet.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import { SpeedBindVersion } from './decorators/SpeedBinb';

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, '.card-body.book-detail h3')
@Common.MangasMultiPageCSS('div#Title .row.book-list', Common.PatternLinkGenerator('/browse/title?ttlpage={page}'), 0,
    element => ({
        id: element.querySelector<HTMLAnchorElement>('a').pathname,
        title: element.querySelector<HTMLHeadingElement>('h3').innerText.trim()
    }))
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016130, true)
@SpeedBinb.ImageAjax()

export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mangaplanet', `MangaPlanet`, 'https://mangaplanet.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('mpaconf', '18')`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '#accordion div[id*="vol_"]');
        const chapters: Chapter[] = [];
        for (const volume of data) {
            const title = volume.querySelector('h3').textContent.trim() + " - ";

            for (const chapter of [...volume.querySelectorAll(".list-group")].filter(e => e.querySelector('a') != null)) {
                const origurl = /'([a-z0-9:/.?=]*)'/g.exec(chapter.querySelector('a').getAttribute("@click"))[1];
                //the chapter site gives different urls. sometimes you first get redirected to a login or 18+ restricted page other times not.
                let chapid = origurl.split("/").slice(-1)[0];
                if (chapid.includes("?")) {
                    chapid = chapid.split("=").slice(-1)[0];//gets the id of the cid parameter
                }
                let url = "";
                if (origurl.includes("/reader")) {
                    url = "/reader?cid=" + chapid;
                } else if (origurl.includes("/viewer")) {
                    url = "https://image.mangaplanet.com/viewer/" + chapid;
                }
                chapters.push(new Chapter(this, manga, url, title + chapter.querySelector<HTMLSpanElement>('h3 span').innerText.trim()));
            }
        }
        return chapters;
    }
}