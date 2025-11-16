import { Tags } from '../Tags';
import icon from './Rawkuma.webp';
import NatsuID from './NatsuID';

export default class extends NatsuID {

    public constructor() {
        super('rawkuma', 'Rawkuma', 'https://rawkuma.net', [Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator]);
    }

    public override get Icon() {
        return icon;
    }
}