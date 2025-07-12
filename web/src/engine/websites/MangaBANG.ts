import { Tags } from '../Tags';
import icon from './MangaBANG.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {
    public constructor() {
        super('mangabang', `MangaBANG Comics (マンガBANG コミックス)`, 'https://comics.manga-bang.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}