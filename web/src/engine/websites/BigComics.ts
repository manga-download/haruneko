import { Tags } from '../Tags';
import icon from './BigComics.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {

    public constructor() {
        super('bigcomics', `Big Comics`, 'https://bigcomics.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}