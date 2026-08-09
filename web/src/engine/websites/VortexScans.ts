import { Tags } from '../Tags';
import icon from './VortexScans.webp';
import { VTheme } from './templates/VTheme';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga } from '../providers/MangaPlugin';

@Common.PagesSinglePageCSS('section[itemprop="articleBody"] figure img:not([itemprop])')
export default class extends VTheme {

    public constructor() {
        super('vortexscans', 'Vortex Scans', 'https://vortexscans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { id, title } = await FetchWindowScript<{ id: number, title: string }>(new Request(new URL(url)), `
            new Promise(resolve => {
                const element = document.querySelector('astro-island[opts*="SeriesDescriptionIsland"]');
                element.hydrator = () => (_, props) => {
                    resolve({ id: props.post.id, title: props.post.postTitle.trim()});
                };
                element.hydrate();
            });
        `, 500);
        return new Manga(this, provider, `${ id }`, title);
    }

}