import { Tags } from '../Tags';
import icon from './ComicGrowl.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {
    public constructor() {
        super('comicgrowl', `コミックグロウル (Comic Growl)`, 'https://comic-growl.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }
    public override get Icon() {
        return icon;
    }
}