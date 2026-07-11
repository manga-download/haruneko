import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, type Manga } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import { Priority } from '../taskpool/DeferredTask';
import icon from './LineWebtoon.webp';
import { LineWebtoonBase } from './templates/LineWebtoonBase';

type APIChapters = {
    result: {
        episodeList: {
            episodeTitle: string;
            viewerLink: string;
        }[];
    };
};
export default class extends LineWebtoonBase {

    public constructor() {
        super('linewebtoon', 'Line Webtoon', 'https://www.webtoons.com', Tags.Language.Multilingual, Tags.Media.Manhwa, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const titleId = new URL(manga.Identifier, this.URI).searchParams.get('title_no');
        const [, language, type] = manga.Identifier.split('/');
        const requestURL = new URL(`./api/v1/${type === 'canvas' ? type : 'webtoon'}/${titleId}/episodes?pageSize=99999`, 'https://m.webtoons.com');
        if (type == 'canvas') requestURL.searchParams.set('readingLanguageCode', language);

        const { result: { episodeList } } = await this.interactionTaskPool.Add(() => FetchJSON<APIChapters>(new Request(requestURL, {
            headers: {
                Referer: 'https://m.webtoons.com/'
            }
        })), Priority.Normal);
        return episodeList.map(({ viewerLink, episodeTitle }) => new Chapter(this, manga, viewerLink, episodeTitle));
    }
}