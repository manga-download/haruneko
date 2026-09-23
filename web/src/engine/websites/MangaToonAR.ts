import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';

export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-ar', `MangaToon (Arabic)`, 'https://ar.mangatoon.mobi', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Official);
        this.WithLanguage('ar');
    }

    public override get Icon() {
        return icon;
    }
}