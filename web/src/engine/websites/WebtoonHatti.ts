import { Tags } from '../Tags';
import icon from './WebtoonHatti.webp';
import { Fetch } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

const allowedImageOrigins = [
    'https://cdn-2.webtoonhatti.com',
];

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webtoonhatti', 'Webtoon Hatti', 'https://webtoonhatti.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = (await Madara.FetchPagesSinglePageCSS.call(this, chapter)).filter(page => {
            return allowedImageOrigins.includes(page.Link.origin);
        });
        const status = await Promise.all(pages.map(async page => {
            try {
                return (await Fetch(new Request(page.Link, { method: 'HEAD' }))).status;
            } catch {
                return 0;
            }
        }));
        return pages.filter((_, index) => status[index] !== 404);
    }

    /*
    TODO: Extract reporting function to push user encountered image errors into a timeseries database ...
    import type { MediaChild, MediaContainer } from '../providers/MediaPlugin';
    private async NotifyBrokenImageLinks(media: MediaContainer<MediaChild>, brokenURLs: string[]): Promise<void> {
        const response = await fetch('https://report.hakuneko.workers.dev/webtoonhatti', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                media: {
                    id: media.Identifier,
                    title: media.Title,
                },
                parent: {
                    id: media.Parent?.Identifier ?? '-',
                    title: media.Parent?.Title ?? '-',
                },
                resources: brokenURLs,
            }, null, 2),
        });

        if (response.status !== 201) {
            throw new Error(`Failed to report broken image links: ${response.status} - ${await response.text()}`);
        } else {
            //console.log('Reported:', await response.text());
        }
    }
    */
}