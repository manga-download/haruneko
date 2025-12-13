import { Tags } from '../Tags';
import icon from './MainaScans.webp';
import { FetchGraphQL, FetchNextJS } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import LetonaScans from './LetonaScans';

@Common.ImageAjax()
export default class extends LetonaScans {

    public constructor() {
        super('mainascans', 'Maina Scans', 'https://mainascans.com');
    }

    public override get Icon() {
        return icon;
    }
}