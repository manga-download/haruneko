import { Tags } from '../Tags';
import icon from './MangaLivreBlog.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';
import { GetBytesFromHex } from '../BufferEncoder';

type ChapterData = {
    urlStart: string;
    domainEnd: string;
    extension: string;
};

const chapterScript = `
    new Promise( resolve => {
        const baselink = 'https://articles.onemoreplace.tw/online/new-' + location.pathname.split('/').at(-1)+'?ch=';
        const chapters = [...document.querySelectorAll('div#chapters ul li > a')];
        resolve( chapters.map( chapter => {
            return {
                id: baselink + chapter.getAttribute('onclick').match(/-(\\d+)\.html/).at(1),
                title: chapter.text.trim()
            };
        }));
    })
`;

@Common.MangaCSS(/^{origin}\/html\/\d+\.html$/, 'meta[name="name"]')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.cat2_list a', Common.PatternLinkGenerator('/comic/u-{page}.html'), 0, anchor => ({
    id: anchor.pathname, title: anchor.querySelector('.cat2_list_name').textContent.trim()
}))
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('eightcomic', '8 Comic', 'https://www.8comic.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

        function Decode(l: string): number { const az = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"; const a = l.substring(0, 1); const b = l.substring(1, 2); if (a == "Z") return 8000 + az.indexOf(b); else return az.indexOf(a) * 52 + az.indexOf(b); }
        function SubStr(data: string, _start: number, length: number = 40): string { return (data + '').substring(_start, _start + length); }
        function ZeroPad(number: number): string { return number < 10 ? `00${number}` : number < 100 ? `0${number}` : `${number}`; }
        function ComputeImageNameIndex(p: number) { return (p - 1) / 10 % 10 + (p - 1) % 10 * 3; };

        const chapterUrl = new URL(chapter.Identifier);
        const mangaId = chapter.Parent.Identifier.split('/').at(-1).replace('.html', '');
        const chapterNumber = chapterUrl.searchParams.get('ch');

        const [chapterData] = await FetchRegex(new Request(chapterUrl, {
            headers: { Referer: this.URI.href }
        }), /var.*=\s*['"]([a-zA-Z-0-9]{141,})['"]/g);

        let imageCount = 0, currentChapNumber = '', fileNameData = '', suffix = '', serverAndfolder = '';

        //find good data
        for (var i = 0; i < 200; i++) {
            currentChapNumber = Decode(SubStr(chapterData, i * 47 + 0, 2)).toString();
            serverAndfolder = Decode(SubStr(chapterData, i * 47 + 2, 2)).toString();
            fileNameData = SubStr(chapterData, i * 47 + 4);
            imageCount = Decode(SubStr(chapterData, i * 47 + 44, 2));
            suffix = SubStr(chapterData, i * 47 + 46, 1);
            if (currentChapNumber == chapterNumber) break;
        }

        const [serverIndex, subfolder] = serverAndfolder.split('');
        const { urlStart, domainEnd, extension } = this.ExtractStaticData(chapterData);

        return new Array(imageCount).fill(null).map((_, index) => {
            const url = [
                urlStart + serverIndex + domainEnd,
                subfolder,
                mangaId,
                chapterNumber,
                suffix == '0' ? undefined : suffix,
                ZeroPad(index + 1) + '_' + SubStr(fileNameData, ComputeImageNameIndex(index + 1), 3) + '.' + extension
            ].join('/');
            return new Page(this, chapter, new URL(url));
        });
    }

    private ExtractStaticData(chapterData: string): ChapterData {
        function GetStaticData(index: number): string { return new TextDecoder().decode(GetBytesFromHex(chapterData.substring(chapterData.length - 47 - index * 6, chapterData.length - 47 - index * 6 + 6))); }

        return {
            urlStart: 'https://' + GetStaticData(4), //"img",
            domainEnd: '.8' + GetStaticData(3) + GetStaticData(2) + GetStaticData(3),// '.8'+ 'com'+ '.ic' + 'com'
            extension: GetStaticData(1)// "jpg"
        }
    }
}