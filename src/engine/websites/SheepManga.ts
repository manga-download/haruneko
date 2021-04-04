import { MangaScraper, MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';

export default class extends MangaScraper {

    public constructor() {
        super('sheepmanga', 'Sheep\'s Awesome Mangas', 'https://raw.githubusercontent.com');
    }

    /*
    public const Tags = [
        new Tag(Tags.Media, [ Media.Manga, Media.Manhua, Media.Novel ])
    ];
    */

    public async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            new Manga(this, provider, '/hn1', 'HaruNeko is'),
            new Manga(this, provider, '/hn2', 'Awesome'),
            new Manga(this, provider, '/fake1', 'Fake1'),
            new Manga(this, provider, '/fake2', 'Fake2ButThisOneIsSuperLongAndIDontWantToSeeMoreOfThis'),
            new Manga(this, provider, '/fake3', 'Fake3'),
            new Manga(this, provider, '/fake4', 'Fake4'),
            new Manga(this, provider, '/fake5', 'Fake5'),
            new Manga(this, provider, '/fake6', 'Fake6'),
            new Manga(this, provider, '/fake7', 'Fake7'),
            new Manga(this, provider, '/fake8', 'Fake8'),
            new Manga(this, provider, '/fake9', 'Fake9'),
            new Manga(this, provider, '/fake10', 'Fake10'),
            new Manga(this, provider, '/fake11', 'Fake11'),
            new Manga(this, provider, '/fake12', 'Fake12'),
            new Manga(this, provider, '/fake13', 'Fake13'),
            new Manga(this, provider, '/fake14', 'Fake14'),
            new Manga(this, provider, '/fake15', 'Fake15'),
            new Manga(this, provider, '/fake16', 'Fake16'),
            new Manga(this, provider, '/fake17', 'Fake17'),
            new Manga(this, provider, '/fake18', 'Fake18'),
            new Manga(this, provider, '/fake19', 'Fake19'),
            new Manga(this, provider, '/fake20', 'ನನಗೆ ಹಾನಿ ಆಗದೆ, ನಾನು ಗಜ'),
            new Manga(this, provider, '/fake21', '.من می توانم بدونِ احساس درد شيشه بخورم'),
            new Manga(this, provider, '/fake22', 'أنا قادر على أكل الزجاج و هذا لا يؤلمني.'),
            new Manga(this, provider, '/fake23', '我能吞下玻璃而不傷身體。'),
            new Manga(this, provider, '/fake24', '私はガラスを食べられます。それは私を傷つけません。'),
            new Manga(this, provider, '/fake25', 'Ljœr ye caudran créneþ ý jor cẃran.'),
            new Manga(this, provider, '/fake26', 'Tôi có thể ăn thủy tinh mà không hại gì.'),
            new Manga(this, provider, '/fake27', 'Ég get etið gler án þess að meiða mig.'),
            new Manga(this, provider, '/fake28', 'Fake€€$$£££&é@§%!'),
            new Manga(this, provider, '/fake29', 'Fake29'),
            new Manga(this, provider, '/fake30', 'Fake30'),
            new Manga(this, provider, '/fake31', 'Fake31'),
            new Manga(this, provider, '/fake32', 'Fake32'),
            new Manga(this, provider, '/fake33', 'Fake33'),
            new Manga(this, provider, '/fake34', 'Fake34'),
            new Manga(this, provider, '/fake35', 'Fake35')
        ];
    }

    public async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [
            new Chapter(this, manga, '/001', 'Chapter 1 - Beginning'),
            new Chapter(this, manga, '/999', 'Ch. 999 - The End')
        ];
    }

    public async FetchPages(chapter: Chapter): Promise<Page[]> {
        return [
            new Page(this, chapter, new URL('/manga-download/haruneko/master/sample/MangaBySheep/Chapter1/Page01.png', this.URI)),
            new Page(this, chapter, new URL('/manga-download/haruneko/master/sample/MangaBySheep/Chapter1/Page02.png', this.URI)),
            new Page(this, chapter, new URL('/manga-download/haruneko/master/sample/MangaBySheep/Chapter1/Page03.png', this.URI)),
            new Page(this, chapter, new URL('/manga-download/haruneko/master/sample/MangaBySheep/Chapter1/Page04.png', this.URI)),
            new Page(this, chapter, new URL('/manga-download/haruneko/master/sample/MangaBySheep/Chapter1/Page05.png', this.URI))
        ];
    }
}