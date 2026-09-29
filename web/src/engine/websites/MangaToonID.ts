import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';
export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-id', `MangaToon (Indonesian)`, 'https://mangatoon.mobi/id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Official);
        this.WithLanguage('id');
    }

    public override get Icon() {
        return icon;
    }
}