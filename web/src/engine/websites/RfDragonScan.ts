import { Tags } from '../Tags';
import icon from './RfDragonScan.webp';
import { YomuVerseBase } from './templates/YomuVerseBase';
export default class extends YomuVerseBase {

    public constructor() {
        super('rfdragonscan', 'RF Dragon Scan', 'https://rfdragonscan.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
        this.WithNextActions({
            PaginatedMangas: '40145b9a1ebc261a6e0025b08fe4321fdeaad168d3',
            MangaInfos: '605b188667d9bcd4a1fe806764ae5e8861eff89915',
            Chapters: '60a7496d813253cd0acc35e49c36ec1437f4f9f1eb',
            Pages: '701b928d969fea96b2124f4f8453277895cb6fae3b'
        });
    }

    public override get Icon() {
        return icon;
    }
}