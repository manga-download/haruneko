import { Tags } from '../Tags';
import icon from './JEnta.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {
    public constructor() {
        super('jenta', 'J-Enta', 'https://comic.j-nbooks.jp/', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}