import { Tags } from '../Tags';
import icon from './GComi.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {

    public constructor() {
        super('comicmedu', `G-Comi`, 'https://g-comi.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}