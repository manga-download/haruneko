import { Tags } from '../Tags';
import icon from './Grimelek.webp';
import { InitManga } from './templates/InitManga';

export default class extends InitManga {

    public constructor() {
        super('grimelek', 'Grimelek', 'https://siyahmelek.mom', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}