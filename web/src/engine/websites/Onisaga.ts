import { Tags } from '../Tags';
import icon from './Onisaga.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchHTML, FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { RateLimit } from '../taskpool/RateLimit';

type LiveWireState = {
    token: string;
    snapshot: string;
};

type LiveWireSnapshot = {
    memo: {
        name: string;
    };
};

type LiveWireRequest = {
    _token: string;
    components: [{
        snapshot: string;
        updates: {},
        calls: [{
            method: string;
            path: string;
            params: any[];
        }];
    }];
};

type LiveWireResult = {
    components: [{
        snapshot: string;
        effects: {
            html: string;
        };
    }];
};

type ChapterInfos = {
    token: string;
    totalPages: number;
};

type PageToken = {
    token: string;
};

const chapterLanguageMap = new Map([
    ['en', Tags.Language.English], //keep it FIRST !
    ['es', Tags.Language.Spanish],
    ['es-la', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    ['ja', Tags.Language.Japanese],
    ['pt-br', Tags.Language.Portuguese],
    ['pt', Tags.Language.Portuguese],
]);

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/manga\/[^/]+$/, 'img.h-full.object-cover[loading="eager"]:not([alt=""])', (img, uri) => ({
    id: uri.pathname,
    title: img.alt.trim()
}))
@Common.MangasMultiPageCSS('div[wire\\:target] a[title]:has(h3)', Common.PatternLinkGenerator('/browse?page={page}'), 0, Common.AnchorInfoExtractor(true))
export default class extends DecoratableMangaScraper {

    private apiURL = `${this.URI.origin}/api/`;
    private latestToken: string = undefined;

    public constructor() {
        super('onisaga', 'Onisaga', 'https://onisaga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
        this.imageTaskPool.RateLimit = new RateLimit(1, 2);
    }

    public override get Icon() {
        return icon;
    }

    private async ExtractWireState(endpoint: string, name: string): Promise<LiveWireState> {
        const doc = await FetchHTML(new Request(new URL(endpoint, this.URI)));
        const token = doc.querySelector<HTMLMetaElement>('meta[name=csrf-token]')?.content.trim() ?? doc.querySelector<HTMLInputElement>('input[name=_token]')?.value.trim();
        const candidates = [...doc.querySelectorAll<HTMLElement>('[wire\\:snapshot]')];

        let snapshot: string | null = null;

        for (const candidate of candidates) {
            const currentRaw = candidate.getAttribute('wire:snapshot');
            try {
                const data = <LiveWireSnapshot>JSON.parse(currentRaw);
                if (data?.memo?.name === name) {
                    snapshot = currentRaw;
                    break;
                }
            } catch { }
        }

        return {
            token,
            snapshot
        };
    };

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { token, snapshot } = await this.ExtractWireState(manga.Identifier, 'manga.chapter-list');
        const chapters: Chapter[] = [];

        for (let language of chapterLanguageMap.keys()) {
            const chaptersLang: Chapter[] = [];
            let previousChaptercount = 0;

            //change language
            const response = await this.FetchLiveWire({
                _token: token,
                components: [{
                    calls: [{
                        method: 'setLanguage',
                        params: [language],
                        path: ''
                    }],
                    snapshot,
                    updates: {}
                }]
            });

            let currentSnapshot = response.components[0].snapshot;

            //loop for chapters
            for (let run = true; run && currentSnapshot;) {
                const response = await this.FetchLiveWire({
                    _token: token,
                    components: [{
                        snapshot: currentSnapshot,
                        updates: {},
                        calls: [{ method: 'loadMoreChapters', params: [], path: '' }],
                    }]
                });

                const doc = new DOMParser().parseFromString(response.components[0].effects.html, 'text/html');
                const currentChapters = this.ExtractChaptersFromDoc(doc, manga, language);

                //each loop iteration should fetch MORE chapters, but still fetching the previouses ones
                if (currentChapters.length <= previousChaptercount) run = false;
                previousChaptercount = currentChapters.length;
                chaptersLang.push(...currentChapters);
                currentSnapshot = response.components?.at(0)?.snapshot ?? undefined;
            };

            // api returns ENGLISH chapters when you ask for a language with NO chapters :/
            // So we have to make sure english are fetched first.
            if (!chapters.find(chapter => chapter.Identifier === chaptersLang[0].Identifier)) {
                chapters.push(...chaptersLang);
            }
        }
        return chapters.distinct();
    }

    private async FetchLiveWire(body: LiveWireRequest): Promise<LiveWireResult> {
        return FetchJSON<LiveWireResult>(new Request(new URL('/livewire/update', this.URI), {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-LiveWire': '',
                'Accept': '*/*',
                'Content-type': 'application/json',
                'Referer': this.URI.href,
                'Origin': this.URI.origin,
            },
            body: JSON.stringify(body)
        }));
    }

    private ExtractChaptersFromDoc(doc: Document, manga: Manga, languageCode: string,): Chapter[] {
        const chapters: Chapter[] = [];

        const elements = doc.querySelectorAll('a.gap-4:has(div[data-flux-heading]), ui-dropdown:has(button div[data-flux-heading]');
        elements.forEach(el => {
            let title = [el.querySelector('div[data-flux-heading]').textContent.trim(), `[${languageCode}]`].joinTitleSegments();
            if (el instanceof HTMLAnchorElement) {
                chapters.push(new Chapter(this, manga, el.pathname, title, ...[chapterLanguageMap.get(languageCode)].filter(Boolean)));
            } else {
                const links = [...el.querySelectorAll<HTMLAnchorElement>('ui-menu a[data-flux-menu-item]')];
                links.forEach((link, index) => {
                    let group = link.querySelector('span.truncate.italic')?.textContent.trim();
                    if (!group || /^unknown/i.test(group)) group = `Unknown ${index + 1}`;
                    chapters.push(new Chapter(this, manga, link.pathname, [title, `[${group}]`].joinTitleSegments(), ...[chapterLanguageMap.get(languageCode)].filter(Boolean)));
                });
            }
        });
        return chapters;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageToken>[]> {
        const { token, totalPages } = await this.FetchChapterInfos(chapter.Identifier);
        return new Array(totalPages).fill(0).map((_, index) => index).map(page => new Page<PageToken>(this, chapter, new URL(`./chapter/${chapter.Identifier.split('/').at(-1)}/page/${page}`, this.apiURL), { token, Referer: this.URI.href }));
    };

    private async FetchChapterInfos(chapterId: string): Promise<ChapterInfos> {
        const doc = await FetchHTML(new Request(new URL(chapterId, this.URI)));
        return {
            token: doc.documentElement.innerHTML.match(/readerToken:\s*['"]([^"']+)['"]/).at(1),
            totalPages: parseInt(doc.documentElement.innerHTML.match(/totalPages\s*:\s*(\d+)/).at(1))
        };
    }

    public override async FetchImage(page: Page<PageToken>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {

            const executeFetch = async (token: string): Promise<Blob> => {
                const { url } = await FetchJSON<{ url: string }>(new Request(new URL(page.Link), {
                    signal,
                    headers: {
                        Referer: page.Parameters.Referer,
                        'X-Reader-Token': token
                    }
                }));

                const response = await Fetch(new Request(new URL(url), {
                    signal,
                    headers: {
                        Referer: new URL(page.Parent.Identifier, this.URI).href,
                    }
                }));

                if (!response.ok) {
                    throw new Error();
                }

                return response.blob();
            };

            // 1. Try with the initial token
            try {
                return await executeFetch(page.Parameters.token);
            } catch { }

            // 2. If it fails and latestToken is available/different, try that first
            if (this.latestToken && this.latestToken !== page.Parameters.token) {
                try {
                    return await executeFetch(this.latestToken);
                } catch { }
            }

            // 3. Fallback: fetch a brand new token and try one last time
            const chapterInfo = await this.FetchChapterInfos(page.Parent.Identifier);
            this.latestToken = chapterInfo.token;

            return await executeFetch(this.latestToken);
        }, priority, signal);
    }
}