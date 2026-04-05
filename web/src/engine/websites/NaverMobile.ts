import { Tags } from '../Tags';
import icon from './Naver.webp';
import { NaverBase } from './templates/NaverBase';
import * as Common from './decorators/Common';

@Common.PagesSinglePageCSS('div.toon_view_lst ul li p img.toon_image')
export default class extends NaverBase {

    public constructor() {
        super('navermobile', '네이버 웹툰 (Naver Webtoon Mobile)', 'https://m.comic.naver.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}