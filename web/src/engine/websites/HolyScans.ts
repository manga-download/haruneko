import { Tags } from '../Tags';
import icon from './HolyScans.webp';
import { HolyScanBase } from './templates/HolyScanBase';

export default class extends HolyScanBase {

    public constructor() {
        super('holyscans', 'HolyScans', 'https://holyscans.com.tr', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}