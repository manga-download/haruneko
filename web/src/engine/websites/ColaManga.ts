import { Tags } from '../Tags';
import icon from './ColaManga.webp';
import MangaDig from './MangaDig';

export default class extends MangaDig {

    public constructor() {
        super('colamanga', `Coco漫画`, 'https://www.colamanga.com', [Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Aggregator]);
    }

    public get Icon() {
        return icon;
    }

}