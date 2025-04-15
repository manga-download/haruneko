import { Tags } from '../Tags';
import icon from './StoriaDash.webp';
import { TakeShoboBase } from './templates/TakeShoboBase';

export default class extends TakeShoboBase {

    public constructor() {
        super('storiadash', 'ストーリアダッシュ (Storia Dash)', 'https://storia.takeshobo.co.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}