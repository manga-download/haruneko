import { Tags } from '../Tags';
import icon from './ArgosScan.webp';
import { YomuVerseBase } from './templates/YomuVerseBase';
export default class extends YomuVerseBase {

    public constructor() {
        super('argosscan', 'Argos Scan', 'https://aniargos.com', Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Media.Manhwa, Tags.Media.Manga);
        this.WithNextActions({
            PaginatedMangas: '4035af7067d267c3ca563034975b4b3a3d8671f534',
            MangaInfos: '60e21b1872a4ad76c9a416982cc7a90114cce9a8f7',
            Chapters: '608f3b6ab87910841f18a42e1aabea1f699ee9ac17',
            Pages: '607c009c888b38bb98359a6971528b1ede7891f01b'
        });
    }

    public override get Icon() {
        return icon;
    }
}