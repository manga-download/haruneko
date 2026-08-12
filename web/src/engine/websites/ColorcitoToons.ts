import { Tags } from '../Tags';
import icon from './ColorcitoScans.webp';
import ColorcitoScans from './ColorcitoScans';
export default class extends ColorcitoScans {

    public constructor() {
        super('colorcitotoons', 'Colorcito Toons', 'https://colorcitotoons.site', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}