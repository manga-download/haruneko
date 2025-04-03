import { Tags } from '../Tags';
import icon from './COMICMeDu.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {
    public constructor() {
        super('comicmedu', `COMIC MeDu (こみっくめづ)`, 'https://comic-medu.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}