import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';

export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-pt', `MangaToon (Portuguese)`, 'https://mangatoon.mobi/pt', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Official);
        this.WithLanguage('pt');
    }

    public override get Icon() {
        return icon;
    }
}