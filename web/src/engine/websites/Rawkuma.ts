import { Tags } from '../Tags';
import icon from './Rawkuma.webp';
import { KiruBase } from './templates/KiruBase';

export default class extends KiruBase {

    public constructor() {
        super('rawkuma', 'Rawkuma', 'https://rawkuma.net', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}