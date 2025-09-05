import { Tags } from '../Tags';
import icon from './KimiComi.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {

    public constructor() {
        super('kimicomi', 'キミコミ (KimiComi)', 'https://kimicomi.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}