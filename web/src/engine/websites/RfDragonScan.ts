import { Tags } from '../Tags';
import icon from './RfDragonScan.webp';
import { YomuVerseBase } from './templates/YomuVerseBase';
export default class extends YomuVerseBase {

    public constructor() {
        super('rfdragonscan', 'RF Dragon Scan', 'https://rfdragonscan.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
        this.WithNextActions({
            PaginatedMangas: '4089ff400658280006a61d7822c0f82649d6097b75',
            MangaInfos: '60e89cb5963d6bb1b61383872fbfb4cc2726925dd8',
            Chapters: '606c13e60309ce062fade63ac2f1cc68bbc5dc25f4',
            Pages: '6062e8559136ee33cc337e5520fb09950c3dced65e'
        });
    }

    public override get Icon() {
        return icon;
    }
}