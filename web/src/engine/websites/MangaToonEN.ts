import { Tags } from '../Tags';
import icon from './MangaToon.webp';
import { MangaToonBase } from './templates/MangaToonBase';

export default class extends MangaToonBase {

    public constructor() {
        super('mangatoon-en', `MangaToon (English)`, 'https://mangatoon.mobi', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}