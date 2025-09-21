import { Tags } from '../Tags';
import icon from './Batoto.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as AnyACG from './decorators/AnyACG';
import * as Common from './decorators/Common';

const primaryDomain = 'xbato.org';
const patternAliasDomains = [
    primaryDomain,
    'batocomic.com',
    'batocomic.net',
    'batocomic.org',
    'batotoo.com',
    'batotwo.com',
    'battwo.com',
    'comiko.net',
    'comiko.org',
    'readtoto.com',
    'readtoto.net',
    'readtoto.org',
    'xbato.com',
    'xbato.net',
    'zbato.com',
    'zbato.net',
    'zbato.org',
    'dto.to',
    'fto.to',
    'hto.to',
    'jto.to',
    'mto.to',
    'wto.to',
].join('|').replaceAll('.', '\\.');

// TODO: support BatoV3

@AnyACG.MangaCSS(new RegExp(`^https://(${patternAliasDomains})/series/\\d+(/[^/]+)?$`), 'div.mainer div.title-set', 'h3.item-title', 'em.item-flag')
@AnyACG.MangasMultiPageCSS('/browse?page={page}', 'div.series-list div.item-text', 'a.item-title', 'em.item-flag')
@Common.ChaptersSinglePageCSS('div.episode-list div.main a.chapt')
@AnyACG.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('batoto', 'Batoto (by AnyACG)', `https://${primaryDomain}`, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}