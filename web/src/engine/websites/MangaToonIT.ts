import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';
export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-it', `MangaToon (Italian)`, 'https://it.mangatoon.mobi', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Italian, Tags.Source.Official);
        this.WithLanguage('it');
    }

    public override get Icon() {
        return icon;
    }
}