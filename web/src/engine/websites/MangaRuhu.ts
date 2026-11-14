import { Tags } from '../Tags';
import icon from './MangaRuhu.webp';
import { InitManga, queryMangas } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS(queryMangas, Common.PatternLinkGenerator('/manga/page/{page}/'))
export default class extends InitManga {

    public constructor() {
        super('mangaruhu', 'MangaRuhu', 'https://mangaruhu.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}