import { Tags } from '../Tags';
import icon from './ArgosScan.webp';
import { YomuVerseBase } from './templates/YomuVerseBase';
export default class extends YomuVerseBase {

    public constructor() {
        super('argosscan', 'Argos Scan', 'https://aniargos.com', Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Media.Manhwa, Tags.Media.Manga);
        this.WithNextActions({
            PaginatedMangas: '40aee2def6fc69aa3edd831aada51ae82c1ef92111',
            MangaInfos: '6049f7ef4cc65e69a30bca6b521456bde5c66ba6b3',
            Chapters: '6035b8dcaff3a77f48df5dccb3aef5bb48ab88294a',
            Pages: '70b8adde8f206f1a334946aa392d8bc2d141484a70'
        });
    }

    public override get Icon() {
        return icon;
    }
}