import { Tags } from '../Tags';
import icon from './ArgosScan.webp';
import { YomuVerseBase } from './templates/YomuVerseBase';
export default class extends YomuVerseBase {

    public constructor() {
        super('argosscan', 'Argos Scan', 'https://aniargos.com', Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Media.Manhwa, Tags.Media.Manga);
        this.WithNextActions({
            PaginatedMangas: '40b09fe4e810b51a9be09d7b8d7f9900f1bc5f7fa7',
            MangaInfos: '601ce7e470cca09f45d7d39f2668924e80b1c3df0c',
            Chapters: '606716f5913c027ff3c3054981361be598857cefe2',
            Pages: '609b98cc48cafaf9f9eb7a2ef652330137d7198d8f'
        });
    }

    public override get Icon() {
        return icon;
    }
}