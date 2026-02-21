import { Tags } from '../Tags';
import icon from './ChampionCross.webp';
import { ComiciViewer } from'./templates/ComiciViewer';

export default class extends ComiciViewer {

    public constructor() {
        super('championcross', `Champion Cross`, 'https://championcross.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}