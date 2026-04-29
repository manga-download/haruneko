import { Tags } from '../Tags';
import icon from './PlotTwistNoFansub.webp';
import MangasNoSekai from './MangasNoSekai';

export default class extends MangasNoSekai {

    public constructor() {
        super('plottwistnofansub', 'Plot Twist No Fansub', 'https://plotnofansub.com', [Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator]);
        this.WithChaptersAction('plot_anti_hack').WithChapterEndpoint('./wp-json/plot/v1/getcaps7');
    }

    public override get Icon() {
        return icon;
    }
}