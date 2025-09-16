import { Tags } from '../Tags';
import type { Chapter, Page } from '../providers/MangaPlugin';
import icon from './NyxScans.webp';
import { VTheme } from './templates/VTheme';
import { FetchPages } from './VortexScans';

export default class extends VTheme {

    public constructor() {
        super('nyxscans', 'Nyx Scans', 'https://nyxscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        return await FetchPages.call(this, chapter);
    }
}