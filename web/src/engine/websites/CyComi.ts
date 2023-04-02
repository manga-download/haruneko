import { Tags } from '../Tags';
import icon from './CyComi.webp';
import { FetchJSON, FetchRequest } from '../FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

/*
function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('.card-texts-title').textContent.trim();
    const id = anchor.pathname;
    return { id, title };
}

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    const title = anchor.querySelector('.chapter-title').textContent.trim();
    const id = anchor.pathname;
    return { id, title };
}
*/

type APIMangas = {
    data: {
        foo: []
    }
}

type APIChapters = {
    data: {
        chapters: [
            {
                id: number,
                name: string,
            }
        ]
    }
}

type APIPages = {
    data: {
        pages: [
            {
                image: string, // "https://contents.cycomi.com/image_binaries/jpeg/page/419aa45119123f1e498b840b95f92d9b/high/1.jpg?ver=1615959781&Expires=1680401996&Signature=mbbJn3vsNSVcddl2JXS-0m7xB7oBXBwa743s9D8VkTjqZhFkOrcit2WRsFJF~jv9NfxrLvlo5u4qq2XoJ7qUuupe94131-F4NG4n4krK~SEcS7ebp4-EB1gJPi8hUwejlyOM4bIOdsit-OX4R6WUdTltYMyYwbTaNBS2Yq7z4tBg76ejjqV-cMaDyKRZymhQVkx1e9-WPcnkwD7vOdmPIGnghrNXD0lTPMWYgYB-we4-~nZBZ6wgCgIDUQVz3F8aTi8PYjB5rxqmuCnKbHt~k4U7z-JjQHo54BGTcm6Zxn50fkOIGYCgItovqJqkvu7SwBniSRSvnsvjjkkZ3suVQqZTZ5Rao5NaGcu7aNTR3vIhyFxnOaScxOJE8WvcI79mxBREg3cNChLUi2bWFw3VoeEEb3xDtl9O8-ZqElSZinPdSw1DHRhOv18-fWpd7VNdtHof7tFnqJ-hmT-TnnaEnrFyhX1C1SYJN2ZCfwGDSgb5~3W0AjH4RQB~FOP3Y7Ket2pOS42ajoOTQfB0DSQFJQ~bRrKHgrAwjaFYnS-4sEYRpDItCWNTgYq345nJNTNygErafR7MZXuORqWubitSQ4aN1caUMguiHh3rHjNB1qhr--7Og597ba20rE1BxBq-p61biPRdAN7PXUKdMviGVHYqDeN6146aHXFbmfPqfo8_&Key-Pair-Id=APKAJ3UXJUBPLEOGBMDQ"
                pageNumber: number, // 1
                type: string, // "image"
            }
        ]
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://web.cycomi.com/api';

    public constructor() {
        super('cycomi', `CyComi`, 'https://cycomi.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/title/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        // https://web.cycomi.com/api/title/detail?titleId=156
        return new Manga(this, provider, '156', 'あなたは私におとされたい');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        // https://web.cycomi.com/api/home/paginatedList?limit=50&page=0
        return [ new Manga(this, provider, '156', 'あなたは私におとされたい') ];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        // https://web.cycomi.com/api/title/detail?titleId={manga.id}
        return [ new Chapter(this, manga, '12036', '第１話 - ジュウネンメノボクタチ') ];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const request = new FetchRequest(this.apiURL + '/chapter/page/list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                titleId: parseInt(chapter.Parent?.Identifier ?? ''),
                chapterId: parseInt(chapter.Identifier)
            })
        });
        const { data: { pages } } = await FetchJSON<APIPages>(request);
        return pages
            .filter(page => page.type === 'image')
            // TODO: sort by pageNumber ...
            //.sort(page => page.pageNumber)
            .map(page => new Page(this, chapter, new URL(page.image), { Referer: this.URI.href }));
    }
}