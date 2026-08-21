import { Tags } from '../Tags';
import icon from './DongManManhua.webp';
import * as Common from './decorators/Common';
import { LineWebtoonBase } from './templates/LineWebtoonBase';

function ChapterExtractor(element: HTMLAnchorElement) {
    const chapter = element.querySelector('span.tx');
    let title = chapter ? chapter.textContent.trim() + ' - ' : '';
    title += element.querySelector('span.subj span').textContent.trim();
    const id = /'/.test(element.href) ? decodeURIComponent(element.href).match(/'([^']+)'/)[1] : element.pathname + element.search;
    return { id, title };
}

@Common.MangasSinglePageCSS<HTMLAnchorElement>('/dailySchedule', 'div.daily_lst ul.daily_card li a.daily_card_item',
    anchor => ({ id: anchor.pathname + anchor.search, title: anchor.querySelector('p.subj').textContent.trim() }))
@Common.ChaptersMultiPageCSS('div.detail_body div.detail_lst ul li > a', Common.PatternLinkGenerator('{id}&page={page}'), 0, ChapterExtractor)
export default class extends LineWebtoonBase {
    public constructor() {
        super('dongmanmanhua', `咚漫 (DongMan Manhua)`, 'https://www.dongmanmanhua.cn', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Official);
        this.WithMangaRegex(/[^/]+\/[^/]+\/list\?title_no=\d+$/).WithMangaTitleCSS('div.info .subj');
    }

    public override get Icon() {
        return icon;
    }
}