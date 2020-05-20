import { IMangaHost, IManga, IChapter, Manga, Chapter } from './MangaProvider'
import { MediaContainer } from './MediaContainer';

export default class extends MediaContainer implements IMangaHost {

    constructor() {
        super('manga-provider', 'Sample Manga (Provider)', 'english', null);
    }

    // Mangas | Animes
    public async GetMangas(): Promise<IManga[]> {
        return [
            new Manga('/onepiece', 'One Piece', null, this),
            new Manga('/naruto', 'Naruto', null, this)
        ];
    }

    // Chapters | Episodes
    public async GetChapters(manga: IManga): Promise<IChapter[]> {
        return [
            new Chapter('001', 'Chapter 1 - Beginning','' , manga),
            new Chapter('999', 'Ch. 999 - The End', '', manga)
        ];
    }
/*
    public bla(x: any): void {
        if(x instanceof IManga)
    }
*/
    // Images | HLS Playlist | MP4 Stream
    /*
    public GetMedia(): Promise<IMedia> {
        return null;
    }
    */
}