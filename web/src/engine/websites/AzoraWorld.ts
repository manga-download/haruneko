import { Tags } from '../Tags';
import icon from './AzoraWorld.webp';
import { VTheme } from './templates/VTheme';

export default class extends VTheme {

    public constructor() {
        super('azoraworld', 'ازورا مانجا (AZORA MANGA / WORLD)', 'https://azoramoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}