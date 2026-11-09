import { Tags } from '../Tags';
import icon from './DrakeScans.webp';
import { NovelDexTheme } from './templates/NovelDexTheme';

export default class extends NovelDexTheme {

    public constructor () {
        super('drakescans', 'Drake Scans', 'https://drakecomic.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}