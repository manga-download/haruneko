import { Tags } from '../Tags';
import icon from './FlixScansOrg.webp';
import GalaxyManga from './GalaxyManga';

export default class extends GalaxyManga {

    public constructor() {
        super('flixscansorg', 'FlixScans (.org)', 'https://flixscans.org', [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator], 'https://flixscans.site/api/v1/', 'https://media.flixscans.org' );
    }

    public override get Icon() {
        return icon;
    }

}