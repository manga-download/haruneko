import { Tags } from '../Tags';
import icon from './MangaZegra.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {

    public constructor() {
        super('mangazegra', 'Manga Zegra', 'https://manga-zegra.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}