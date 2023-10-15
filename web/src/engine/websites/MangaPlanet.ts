import { Tags } from '../Tags';
import icon from './MangaPlanet.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS, FetchRequest, FetchWindowScript } from '../FetchProvider';

function MangaExtractor(element: HTMLElement) {
    const id = element.querySelector('a').pathname;
    const title = element.querySelector('h3').innerText.trim();
    return {id, title};
}

@Common.MangaCSS(/^https?:\/\/mangaplanet\.com\/comic\/\S+$/, '.card-body.book-detail h3')
@Common.MangasMultiPageCSS('/browse/title?ttlpage={page}', 'div#Title .row.book-list', 1, 1, 0, MangaExtractor)
@SpeedBinb.PagesSinglePage()
@SpeedBinb.ImageAjax()

export default class extends DecoratableMangaScraper {
    public constructor() {
        super('mangaplanet', `MangaPlanet`, 'https://mangaplanet.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        const request = new FetchRequest(this.URI.href);
        return FetchWindowScript(request, `window.cookieStore.set('mpaconf', '18')`);
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const uri = new URL(manga.Identifier, this.URI);
        const request = new FetchRequest(uri.href);
        const data = await FetchCSS(request, '#accordion div[id*="vol_"]');
        const chapters : Chapter[] = [];
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
                    url = "/reader?cid=" + chapid + "&sk=1";
                } else if (origurl.includes("/viewer")) {
                    url = "https://image.mangaplanet.com/viewer/" + chapid;
                }
                chapters.push(new Chapter(this, manga, url, title + chapter.querySelector('span').innerText.trim()));
            }
        }
        return chapters;
    }
}