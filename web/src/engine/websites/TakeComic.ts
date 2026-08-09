import { Tags } from '../Tags';
import icon from './TakeComic.webp';
import { ComiciViewer } from './templates/ComiciViewer';
export default class extends ComiciViewer {

    public constructor() {
        super('takecomic', `TakeComic`, 'https://takecomic.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}