import { Tags } from '../Tags';
import { FetchCSS } from '../platform/FetchProvider';
import { Page, type Chapter } from '../providers/MangaPlugin';
import icon from './VortexScans.webp';
import { VTheme } from './templates/VTheme';

type JSONImage = {
    url: string
}

export default class extends VTheme {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator );
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const scripts = await FetchCSS<HTMLScriptElement>(new Request(new URL(chapter.Identifier, this.URI)), 'script:not([src])');
        const imagesRegexp = /\\"images\\":(\[.*]),\\"nextChapter/;
        const goodscript = scripts.find(script => imagesRegexp.test(script.text));
        const images: JSONImage[] = JSON.parse(goodscript.text.match(imagesRegexp)[1].replaceAll('\\', ''));
        return images.map(image => new Page(this, chapter, new URL(image.url), { Referer: this.URI.href }));
    }
}
