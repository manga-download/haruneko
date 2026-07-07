import { Tags } from '../Tags';
import icon from './RagnarScans.webp';
import { InitManga } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('h2.manga-card-title a', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.chapter-list a', Common.PatternLinkGenerator('{id}bolum/page/{page}/'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector<HTMLHeadingElement>('div.uk-flex-none').innerText.trim().replace(/^.*\s*–\s*Bölüm/, 'Bölüm').trim() }))
export default class extends InitManga {

    public constructor() {
        super('ragnarscans', 'Ragnar Scans', 'https://ragnarscans.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}