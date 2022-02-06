// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LovableSubs.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lovablesubs', `lovablesubs`, 'https://lovablesubs.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LovableSubs extends WordPressMadara {

    constructor() {
        super();
        super.id = 'lovablesubs';
        super.label = 'lovablesubs';
        this.tags = [ 'manga', 'turkish' ];
        this.url = 'https://lovablesubs.com';
    }

    getFormatRegex() {
        return {
            chapterRegex: /\s*(?:^|ch\.?|ep\.?|chapter|Bölüm|chapitre|episode|#)?\s*([\d.?\-?v?,?]+)\s*(?:^|ch\.?|ep\.?|chapter|\.?Bölüm|chapitre|episode|#)?\s*(?:\s|:|$)+/i, // $ not working in character groups => [\s\:$]+ does not work
            volumeRegex: super.getFormatRegex().volumeRegex
        };
    }
}
*/