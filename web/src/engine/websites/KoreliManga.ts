import { Tags } from '../Tags';
import icon from './KoreliManga.webp';
import { InitManga, queryMangas, queryChapters, ChapterExtractor } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS(queryMangas, Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>(queryChapters, Common.PatternLinkGenerator('{id}chapter/page/{page}/'), 0, ChapterExtractor)
export default class extends InitManga {
    public constructor() {
        super('korelimanga', 'KoreliManga', 'https://korelimanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}