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
            new Manga('/fake4', 'Fake4', null, this),
            new Manga('/fake5', 'Fake5', null, this),
            new Manga('/fake6', 'Fake6', null, this),
            new Manga('/fake7', 'Fake7', null, this),
            new Manga('/fake8', 'Fake8', null, this),
            new Manga('/fake9', 'Fake9', null, this),
            new Manga('/fake10', 'Fake10', null, this),
            new Manga('/fake11', 'Fake11', null, this),
            new Manga('/fake12', 'Fake12', null, this),
            new Manga('/fake13', 'Fake13', null, this),
            new Manga('/fake14', 'Fake14', null, this),
            new Manga('/fake15', 'Fake15', null, this),
            new Manga('/fake16', 'Fake16', null, this),
            new Manga('/fake17', 'Fake17', null, this),
            new Manga('/fake18', 'Fake18', null, this),
            new Manga('/fake19', 'Fake19', null, this),
            new Manga('/fake20', 'ನನಗೆ ಹಾನಿ ಆಗದೆ, ನಾನು ಗಜ', null, this),
            new Manga('/fake21', '.من می توانم بدونِ احساس درد شيشه بخورم', null, this),
            new Manga('/fake22', 'أنا قادر على أكل الزجاج و هذا لا يؤلمني.', null, this),
            new Manga('/fake23', '我能吞下玻璃而不傷身體。', null, this),
            new Manga('/fake24', '私はガラスを食べられます。それは私を傷つけません。', null, this),
            new Manga('/fake25', 'Ljœr ye caudran créneþ ý jor cẃran.', null, this),
            new Manga('/fake26', 'Tôi có thể ăn thủy tinh mà không hại gì.', null, this),
            new Manga('/fake27', 'Ég get etið gler án þess að meiða mig.', null, this),
            new Manga('/fake28', 'Fake€€$$£££&é@§%!', null, this),
            new Manga('/fake29', 'Fake29', null, this),
            new Manga('/fake30', 'Fake30', null, this),
            new Manga('/fake31', 'Fake31', null, this),
            new Manga('/fake32', 'Fake32', null, this),
            new Manga('/fake33', 'Fake33', null, this),
            new Manga('/fake34', 'Fake34', null, this),
            new Manga('/fake35', 'Fake35', null, this)
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
            new Page('https://github.com/manga-download/haruneko/blob/master/sample/MangaBySheep/Chapter1/Page01.png', chapter),
            new Page('https://github.com/manga-download/haruneko/blob/master/sample/MangaBySheep/Chapter1/Page02.png', chapter),
            new Page('https://github.com/manga-download/haruneko/blob/master/sample/MangaBySheep/Chapter1/Page03.png', chapter),
            new Page('https://github.com/manga-download/haruneko/blob/master/sample/MangaBySheep/Chapter1/Page04.png', chapter),
            new Page('https://github.com/manga-download/haruneko/blob/master/sample/MangaBySheep/Chapter1/Page05.png', chapter),
        ];
    }
}