import { Tags } from '../Tags';
import icon from './LineWebtoon.webp';
import { LineWebtoonBase } from './templates/LineWebtoonBase';
export default class extends LineWebtoonBase {
    public constructor() {
        super('linewebtoon', 'Line Webtoon', 'https://www.webtoons.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}