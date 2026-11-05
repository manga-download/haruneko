import { Tags } from '../Tags';
import icon from './HanaYume.webp';
import { ComiciViewer } from './templates/ComiciViewer';

export default class extends ComiciViewer {

    public constructor () {
        super('hanayume', 'HanaYume', 'https://hanayume.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}