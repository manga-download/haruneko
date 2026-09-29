import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';

export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-de', `MangaToon (German)`, 'https://de.mangatoon.mobi', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.German, Tags.Source.Official);
        this.WithLanguage('de');
    }

    public override get Icon() {
        return icon;
    }
}