import { Tags } from '../Tags';
import icon from './KanMan.webp';
import MHKX, { type MhkxInfos } from './decorators/MHKX';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';
import { Manga, type MangaPlugin } from '../providers/MangaPlugin';

@Common.ImageAjax(true)
export default class extends MHKX {
    public constructor() {
        const product: MhkxInfos = {
            id: '1',
            name: 'kmh',
            platform: 'pc'
        };

        super('kanman', `看漫画 (KanMan)`, 'https://www.kanman.com', product, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [data] = await FetchCSS(new Request(url), 'h1.title');
        const id: string = url.match(/(\d+)\/$/)[1];
        const title = data.textContent.trim();
        return new Manga(this, provider, id, title);
    }
}