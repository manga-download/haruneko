import { Tags } from '../Tags';
import icon from './Mgread.webp';
import { InitManga, queryMangas } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS(queryMangas, Common.PatternLinkGenerator('/manga/page/{page}/'))
export default class extends InitManga {

    public constructor() {
        super('mgread', 'Mgread', 'https://mgread.io', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}