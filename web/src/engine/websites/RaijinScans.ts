import { Tags } from '../Tags';
import icon from './RaijinScans.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchHTML, FetchWindowScript } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.serie-info h1.serie-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raijinscans', 'RaijinScans', 'https://raijin-scans.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('manga/-/', this.URI)), '');
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const doc = await FetchHTML(new Request(new URL(chapter.Identifier, this.URI)));
        const rmd = doc.body.innerHTML.match(/window\._rmd\s*=\s*["']([^"']+)["']/).at(1).replaceAll('-', '+').replaceAll('_', '/');
        const rmk = doc.body.innerHTML.match(/window\._rmk\s*=\s*["']([^"']+)["']/).at(1);

        // XOR(rmd) with XORED key rmk => JSON array of url strings
        const pages = JSON.parse(new TextDecoder().decode(this.XOR(rmd, this.XOR(rmk, new Uint8Array([90, 60, 126, 29, 159, 178, 78, 106]))))) as string[];
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }

    private XOR(data: string, key: Uint8Array): Uint8Array {
        //Don't use GetBytesFromB64 because their B64 is sometimes unpadded and fails our integrity checks
        const decoded = Uint8Array.from(atob(data.replace(/\s+/g, '')), c => c.charCodeAt(0));
        return decoded.map((value, index) => value ^ key[index % key.length]);
    }

}
