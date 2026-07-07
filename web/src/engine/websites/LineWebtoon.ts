import { Tags } from '../Tags';
import icon from './LineWebtoon.webp';
import * as Common from './decorators/Common';
import { ChapterExtractor, LineWebtoonBase } from './templates/LineWebtoonBase';

@Common.ChaptersMultiPageCSS('div.detail_list_area ul.detail_list li > a', Common.PatternLinkGenerator('{id}&page={page}'), 0, ChapterExtractor)
export default class extends LineWebtoonBase {

    public constructor() {
        super('linewebtoon', 'Line Webtoon', 'https://www.webtoons.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}