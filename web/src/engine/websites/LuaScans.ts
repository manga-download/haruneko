import { Tags } from '../Tags';
import icon from './LuaScans.webp';
import { HeanCMS } from './templates/HeanCMS';

export default class extends HeanCMS {
    public constructor() {
        super('luascans', 'Lua Scans', 'https://luacomic.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}