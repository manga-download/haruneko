import { Tags } from '../Tags';
import icon from './GodaComic.webp';
import { Chapter, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import GodaManhua, { chapterScript, type ChapterID } from './GodaManhua';

@Common.PagesSinglePageCSS('div#chapcontent img[data-src]')
@Common.ImageAjax()
export default class extends GodaManhua {

    public constructor() {
        super('godacomic', 'GodaComic', 'https://manhuascans.org', [Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator]);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier.replace('/manga/', '/chapterlist/'), this.URI));
        const chapters = await FetchWindowScript<{ id: string, title: string }[]>(request, chapterScript, 2000);
        return chapters.map(chapter => {
            const { mangaid, id } = JSON.parse(chapter.id) as ChapterID;
            return new Chapter(this, manga, `./chapter/getcontent?m=${mangaid}&c=${id}`, chapter.title.replace(manga.Title, '').trim() || chapter.title);
        });
    }

}