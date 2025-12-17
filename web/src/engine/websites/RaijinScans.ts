import { Tags } from '../Tags';
import icon from './RaijinScans.webp';
import { FetchCSS, FetchWindowScript } from '../platform/FetchProvider';
import { GetBytesFromBase64, GetBytesFromURLBase64 } from '../BufferEncoder';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

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
        const [body] = await FetchCSS<HTMLBodyElement>(new Request(new URL(chapter.Identifier, this.URI)), 'body');
        const encrypted = GetBytesFromURLBase64(body.innerHTML.match(/window\._rmd\s*=\s*["']([^"']+)["']/).at(-1));
        const keyData = GetBytesFromBase64(body.innerHTML.match(/window\._rmk\s*=\s*["']([^"']+)["']/).at(-1));
        const keySeed = new Uint8Array([90, 60, 126, 29, 159, 178, 78, 106]);

        const pages = JSON.parse(new TextDecoder().decode(this.XOR(encrypted, this.XOR(keyData, keySeed)))) as string[];
        return pages.map(page => new Page(this, chapter, new URL(page)));
    }

    private XOR(bytes: Uint8Array, key: Uint8Array): Uint8Array {
        return bytes.map((byte, index) => byte ^ key[index % key.length]);
    }
}