import { Tags } from '../Tags';
import icon from './NewToki.webp';
import * as Common from './decorators/Common';
import Manatoki from './Manatoki';

@Common.MangaCSS(/^https:\/\/newtoki\d+\.com\/webtoon\/\d+(\/[^/]+)?$/, 'div.page-title span.page-desc')
@Common.MangasMultiPageCSS('ul#webtoon-list-all div.list-item a:has(span.title)', Common.PatternLinkGenerator('/webtoon/p{page}'))
export default class extends Manatoki {

    public constructor() {
        super('newtoki', `NewToki`, 'https://newtoki468.com', [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation]);
        this.urlPrefix = 'https://newtoki';
    }

    public override get Icon() {
        return icon;
    }
}