import { Tags } from '../Tags';
import icon from './GammaPlus.webp';
import { TakeShoboBase } from './templates/TakeShoboBase';

export default class extends TakeShoboBase {

    public constructor() {
        super('gammaplus', 'GammaPlus', 'https://gammaplus.takeshobo.co.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}