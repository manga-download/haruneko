import { Tags } from '../Tags';
import icon from './MerlinScans.webp';
import { InitManga } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.chapter-list a', Common.PatternLinkGenerator('{id}bolum/page/{page}/'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('div.uk-flex-none').textContent.trim()
}))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('#chapter-content img')].map(img=> img.dataset?.originalSrc ?? img.src);`, 1500)

export default class extends InitManga {

    public constructor() {
        super('merlinscans', 'MerlinToon', 'https://merlintoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}