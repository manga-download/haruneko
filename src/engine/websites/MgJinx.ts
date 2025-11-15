import { Tags } from '../Tags';
import icon from './MgJinx.webp';
import { ChapterExtractor, MadTheme, queryChapters } from './templates/MadTheme';
import * as Common from './decorators/Common';

@Common.ChaptersSinglePageCSS(queryChapters, undefined, ChapterExtractor)
export default class extends MadTheme {

    public constructor() {
        super('mgjinx', 'MGJINX', 'https://mgjinx.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}