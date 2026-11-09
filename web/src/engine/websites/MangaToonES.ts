import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';

export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-es', `MangaToon (Spanish)`, 'https://mangatoon.mobi/es', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Official);
        this.WithLanguage('es');
    }

    public override get Icon() {
        return icon;
    }
}