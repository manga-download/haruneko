import { Tags } from '../Tags';
import icon from './WebtoonHatti.webp';
import { type Chapter, DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

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
        const pages = await Madara.FetchPagesSinglePageCSS.call(this, chapter);
        try {
            const links = pages.filter(page => page.Link.origin !== 'https://cdn-2.webtoonhatti.com').map(page => `- ${page.Link.href}`);
            if (links.length > 0) {
                await this.NotifyBrokenImageLinks(chapter, links);
            }
        } catch(error) {
            console.log('Failed to report broken image links', error);
        }
        return pages.filter(page => {
            return page.Link.origin === 'https://cdn-2.webtoonhatti.com';
        });
    }

    private async NotifyBrokenImageLinks(chapter: Chapter, brokenLinks: string[]): Promise<void> {
        const sender = Date.now().toString(32) + Math.random().toString(32);
        const content = {
            sender: {
                name: chapter.Parent?.Title ?? sender.toUpperCase().replace('.', ' '),
                email: sender + '@gmail.com',
            },
            subject: chapter.Title,
            text: [
                'Hi,', '',
                'just wanted to let you know, that some image links on your website are broken ;)', '',
                ...brokenLinks,
            ].join('\n')
        };

        const response = await fetch('https://smtp.hakuneko.workers.dev/webtoonhatti', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(content),
        });

        if (response.status !== 201) {
            throw new Error(`Failed to report broken image links: ${response.status} - ${await response.text()}`);
        } else {
            //console.log('Reported:', await response.text());
        }
    }
}