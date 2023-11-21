import { Tags } from '../Tags';
import icon from './ConstellarScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';
import { Fetch, FetchRequest } from '../FetchProvider';

type TSREADER = {
    sources: {
        images : string[]
    }[]
}

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('constellarscans', 'Constellar Scans', 'https://constellarcomic.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const uri = new URL(chapter.Identifier, this.URI);
        const request = new FetchRequest(uri.href);
        const response = await Fetch(request);
        const data = await response.text();
        let tsrundata = '';
        let ts_reader: TSREADER = undefined;

        //get renamed ts_reader
        try {
            tsrundata = data.match(/ts_rea_der_\._run\(([^)]+)/)[1];
            ts_reader = JSON.parse(tsrundata);
        } catch (error) {
            //
        }

        //get renamed ts_reader with crypted data (its a string)
        if (!ts_reader) {
            try {
                tsrundata = data.match(/ts_rea_der_\._run\(['"]([\S]+)['"]/)[1];
                ts_reader = JSON.parse(this.decrypt(tsrundata));
            } catch (error) {
                //
            }
        }

        try {
            return ts_reader.sources.shift().images.map(image => new Page(this, chapter, new URL(image, this.URI)));
        } catch (error) {
            return MangaStream.FetchPagesSinglePageCSS.call(this, chapter, [], 'div#reader_area img[src]:not([src = ""])');
        }

    }

    decrypt(payload) {
        let var1 = '', var2 = '', var3 = 0, var4 = 0;
        let charset = '';

        for (let i = 32; i < 126;i++) {
            charset += window.String.fromCodePoint(i);
        }

        for (let i = 0; i < payload.length; i++) {
            +payload[i] > -1 &&
                (var3 += +payload[i],
                (var4 + 1) % 2 == 0 &&
                    (var1 += var3 + '',
                    var3 = 0,
                    var1.length > 1 && (var2 += charset[+var1], var1 = '')),
                var4++);
        }
        return var2;
    }

}