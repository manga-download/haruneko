import { Tags } from '../Tags';
import icon from './HerosWebNew.webp';
import { ComiciViewer } from'./templates/ComiciViewer';
export default class extends ComiciViewer {

    public constructor() {
        super('heroswebnew', `Hero's (ヒーローズ)( new )`, 'https://heros-web.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}