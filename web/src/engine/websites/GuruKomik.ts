import { Tags } from '../Tags';
import icon from './GuruKomik.webp';
import * as Common from './decorators/Common';
import { PageLinkExtractor, ZeistManga } from './templates/ZeistManga';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'meta[property="og:description"]')
@Common.PagesSinglePageCSS('div#readarea img', PageLinkExtractor)
export default class extends ZeistManga {

    public constructor() {
        super('gurukomik', 'Guru Komik', 'https://gurukomiklive.blogspot.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
        this.WithMangaSlugScript(`new URL(document.querySelector('#chaptermanga script').src, location).pathname.split('/').at(-1)`);
    }

    public override get Icon() {
        return icon;
    }
}