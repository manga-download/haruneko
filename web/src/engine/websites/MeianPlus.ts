import { Tags } from '../Tags';
import icon from './MeianPlus.webp';
import { MeianBase } from './templates/MeianBase';

export default class extends MeianBase {

    public constructor() {
        super('meianplus', 'Meian Plus', 'https://www.meian-plus.fr', Tags.Media.Manga, Tags.Language.French, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}