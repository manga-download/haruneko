import { Tags } from '../Tags';
import icon from './Hipertoon.webp';
import { HiperManga } from './templates/HiperManga';

export default class extends HiperManga {

    public constructor() {
        super('hipertoon', 'Hipertoon', 'https://hipertoon.com', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Portuguese);
        this.WithSecretHeader(false);
    }
    public override get Icon() {
        return icon;
    }
}