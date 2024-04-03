import { Tags } from '../Tags';
import icon from './FlixScansOrg.webp';
import GalaxyManga from './GalaxyManga';

export default class extends GalaxyManga {

    public constructor() {
        super('flixscansorg', 'FlixScans (.org)', 'https://flixscans.org', [Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator]);
        this.apiurl = 'https://flixscans.site/api/v1/webtoon/';
        this.cdnUrl = 'https://media.flixscans.org';
    }

    public override get Icon() {
        return icon;
    }

}