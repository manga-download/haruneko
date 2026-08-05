import { Tags } from '../Tags';
import icon from './RuManhua.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetBytesFromUTF8 } from '../BufferEncoder';

type ImagesData = {
    source_id: string;
    images: string[];
};

type PageParameters = {
    encrypted: boolean;
};

@Common.MangaCSS(/^{origin}\/news\/\d+$/, 'div.comicInfo p.title', Common.WebsiteInfoExtractor({ queryBloat: 'span' }))
@Common.MangasMultiPageCSS('div.ib.info p.title a', Common.PatternLinkGenerator('/category/page/{page}'))
@Common.ChaptersSinglePageCSS('div#chapterlistload a.ib')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rumanhua', 'RuManhua', 'https://www.rumanhua.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParameters>[]> {
        const { source_id: id, images } = await FetchWindowScript<ImagesData>(new Request(new URL(chapter.Identifier, this.URI)), 'params', 1500);
        return images.map(image => {
            return id !== "12" || /^https:\/\//.test(image) ?
                new Page<PageParameters>(this, chapter, new URL(image), { Referer: this.URI.href, encrypted: false }) :
                new Page<PageParameters>(this, chapter, new URL(/^https:\/\//.test(image) ? image : `https://img1.baipiaoguai.org${image}`), { Referer: this.URI.href, encrypted: true });
        });
    }

    public override async FetchImage(page: Page<PageParameters>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        return page.Parameters.encrypted ? this.DecryptImage(await blob.arrayBuffer()) : blob;
    }

    private async DecryptImage(encrypted: ArrayBuffer): Promise<Blob> {
        const ivAndKey = GetBytesFromUTF8('my2ecret782ecret');
        const algorithm = { name: 'AES-CBC', iv: ivAndKey };
        const key = await crypto.subtle.importKey('raw', ivAndKey, algorithm, false, ['decrypt']);
        const decrypted = await crypto.subtle.decrypt(algorithm, key, encrypted);
        return Common.GetTypedData(decrypted);
    }
}