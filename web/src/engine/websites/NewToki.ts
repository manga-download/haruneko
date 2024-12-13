import { Tags } from '../Tags';
import icon from './NewToki.webp';
import * as Common from './decorators/Common';
import Manatoki, { queryManga, queryMangaTitle } from './Manatoki';

@Common.MangaCSS(/^https:\/\/newtoki\d+\.com\/webtoon\/\d+\/[^/]+$/, queryMangaTitle)
@Common.MangasMultiPageCSS('/webtoon/p{page}', queryManga)

export default class extends Manatoki {

    public constructor() {
        super('newtoki', `NewToki`, 'https://newtoki466.com', [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation]);
        this.urlPrefix = 'https://newtoki';
    }

    public override get Icon() {
        return icon;
    }
}