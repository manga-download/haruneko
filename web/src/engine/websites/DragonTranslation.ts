import { Tags } from '../Tags';
import icon from './DragonTranslation.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

type JSONChapters = {
    items: {
        url: string;
        name: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]')
@Common.MangasMultiPageCSS('div#mkAgrid > a', Common.PatternLinkGenerator('/manga/page/{page}/'), 500, Common.AnchorInfoExtractor(true))
@Madara.PagesSinglePageCSS('img.wp-manga-chapter-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dragontranslation', 'DragonTranslation', 'https://dragontranslation.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [script] = await FetchCSS<HTMLScriptElement>(new Request(new URL(manga.Identifier, this.URI)), 'div#mkChapters script[type="application/json"]');
        const { items } = <JSONChapters>JSON.parse(script.text);
        return items.map(({ name, url}) => new Chapter(this, manga, new URL(url).pathname, name));
    }
}