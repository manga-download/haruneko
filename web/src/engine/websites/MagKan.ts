import { Tags } from '../Tags';
import icon from './MagKan.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {
    public constructor() {
        super('magkan', `MagKan`, 'https://kansai.mag-garden.co.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

}