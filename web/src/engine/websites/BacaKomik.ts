import { Tags } from '../Tags';
import icon from './BacaKomik.webp';
import { DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import type { Priority } from '../taskpool/TaskPool';
import { Fetch, FetchRequest } from '../FetchProvider';

@MangaStream.MangaCSS(/^https?:\/\/bacakomik\.me\/komik\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.cpp div.daftarkartun div.jdlbar ul li a.tip', '/daftar-manga/?list')
@MangaStream.ChaptersSinglePageCSS('div.eps_lst ul li span.lchx a')
@MangaStream.PagesSinglePageCSS([], 'div#imagenya-xiaomeng img')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bacakomik', 'BacaKomik', 'https://bacakomik.me', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const request = new FetchRequest(page.Link.href, {
                signal: signal,
            });
            const response = await Fetch(request);
            return response.blob();
        }, priority, signal);
    }
}