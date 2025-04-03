import { Tags } from '../Tags';
import icon from './ComicPash.webp';
import { ComiciViewer } from './templates/ComiciViewer';

export default class extends ComiciViewer {
    public constructor() {
        super('comicpash', `Comic Pash`, 'https://comicpash.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}