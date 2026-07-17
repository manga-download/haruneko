import { Tags } from '../Tags';
import icon from './RagnarScans.webp';
import { InitManga } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangasMultiPageCSS('div.manga-block div.manga-card h2.manga-card-title a', Common.PatternLinkGenerator('/manga/page/{page}/'))
export default class extends InitManga {

    public constructor() {
        super('ragnarscans', 'Ragnar Scans', 'https://ragnarscans.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}