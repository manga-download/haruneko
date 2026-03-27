import { Tags } from '../Tags';
import icon from './Naver.webp';
import { NaverBase } from './templates/NaverBase';

export default class extends NaverBase {

    public constructor() {
        super('naver', '네이버 웹툰 (Naver Webtoon)', 'https://comic.naver.com', Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}