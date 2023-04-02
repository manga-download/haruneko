import { Tags } from '../Tags';
import icon from './DarkSkyProjects.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/darkskyprojects\.org\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
// TODO: Website moved to https://darkskyprojects.blogspot.com (redirect all chapters to lectortmo)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('darkskyprojects', 'DarkSky Projects', 'https://darkskyprojects.org', Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}