import { IMangaHost, IManga, IChapter, IPage, Manga, Chapter, Page } from '../MangaProvider';
import { MediaContainer } from '../MediaContainer';

export default class extends MediaContainer implements IMangaHost {

    constructor() {
        super('manga-provider', 'Sample Manga (Provider)', 'multi-lingual', null);
    }

    // Mangas | Animes
    public async GetMangas(): Promise<IManga[]> {
        return [
            new Manga('/onepiece', 'One Piece', null, this),
            new Manga('/naruto', 'Naruto', null, this),
            new Manga('/fake1', 'Fake1', null, this),
            new Manga('/fake2', 'Fake2ButThisOneIsSuperLongAndIDontWantToSeeMoreOfThis', null, this),
            new Manga('/fake3', 'Fake3', null, this),
            new Manga('/fake4', 'Fake', null, this),
            new Manga('/fake5', 'Fake', null, this),
            new Manga('/fake6', 'Fake', null, this),
            new Manga('/fake7', 'Fake', null, this),
            new Manga('/fake8', 'Fake', null, this),
            new Manga('/fake9', 'Fake', null, this),
            new Manga('/fake10', 'Fake', null, this),
            new Manga('/fake11', 'Fake', null, this),
            new Manga('/fake12', 'Fake', null, this),
            new Manga('/fake13', 'Fake', null, this),
            new Manga('/fake14', 'Fake', null, this),
            new Manga('/fake15', 'Fake', null, this),
            new Manga('/fake16', 'Fake', null, this),
            new Manga('/fake17', 'Fake', null, this),
            new Manga('/fake18', 'Fake', null, this),
            new Manga('/fake19', 'Fake', null, this),
            new Manga('/fake20', 'Fake', null, this),
            new Manga('/fake21', 'Fake', null, this),
            new Manga('/fake22', 'Fake', null, this),
            new Manga('/fake23', 'Fake', null, this),
            new Manga('/fake24', 'Fake', null, this),
            new Manga('/fake25', 'Fake', null, this),
            new Manga('/fake26', 'Fake', null, this),
            new Manga('/fake27', 'Fake', null, this),
            new Manga('/fake28', 'Fake', null, this),
            new Manga('/fake29', 'Fake', null, this),
            new Manga('/fake30', 'Fake', null, this),
            new Manga('/fake31', 'Fake', null, this),
            new Manga('/fake32', 'Fake', null, this),
            new Manga('/fake33', 'Fake', null, this),
            new Manga('/fake34', 'Fake', null, this),
            new Manga('/fake35', 'Fake', null, this)
        ];
    }

    // Chapters | Episodes
    public async GetChapters(manga: IManga): Promise<IChapter[]> {
        return [
            new Chapter('001', 'Chapter 1 - Beginning','' , manga),
            new Chapter('999', 'Ch. 999 - The End', '', manga)
        ];
    }

    // Images | HLS Playlist | MP4 Stream
    public async GetPages(chapter: IChapter): Promise<IPage[]> {
        return [
            new Page('http://img.google.com/a.png', chapter),
            new Page('http://img.google.com/b.png', chapter)
        ];
    }
}