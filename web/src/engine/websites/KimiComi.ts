import { Tags } from '../Tags';
import icon from './KimiComi.webp';
import { ComiciViewer } from './templates/ComiciViewer';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/?$/, 'h1.series-h-title', Common.WebsiteInfoExtractor({ queryBloat: 'span' }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.series-list-item-link', Common.PatternLinkGenerator('/series/list/up/{page}', 1), 0, anchor => ({ id: anchor.pathname, title: anchor.querySelector('div.series-list-item-h span').textContent.trim() }))
export default class extends ComiciViewer {

    public constructor() {
        super('kimicomi', 'キミコミ (KimiComi)', 'https://kimicomi.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
        this.WithEndpointAPI('/api/').WithChaptersFromAPI();
    }

    public override get Icon() {
        return icon;
    }
}