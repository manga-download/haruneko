import { Tags } from '../Tags';
import icon from './ComicRyu.webp';
import { ComiciViewer } from './templates/ComiciViewer';

export default class extends ComiciViewer {

    public constructor() {
        super('comicryu', `COMICリュウ`, 'https://comic-ryu.jp', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}