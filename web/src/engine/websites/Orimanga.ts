import { Tags } from '../Tags';
import icon from './OriManga.webp';
import { InitManga } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS('div.manga-block div.manga-card h2.manga-card-title a', Common.PatternLinkGenerator('/manga/page/{page}/'))
export default class extends InitManga {

    public constructor() {
        super('orimanga', 'OriManga', 'https://orimanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}