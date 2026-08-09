import { Tags } from '../Tags';
import icon from './OriManga.webp';
import { InitManga, queryMangas } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS(queryMangas, Common.PatternLinkGenerator('/manga/page/{page}/'))
export default class extends InitManga {

    public constructor() {
        super('orimanga', 'OriManga', 'https://orimanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}