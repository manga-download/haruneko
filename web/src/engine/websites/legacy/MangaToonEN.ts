import { Tags } from '../../Tags';
import icon from './MangaToonEN.webp';
import MangaToon from '../templates/MangaToon';

export default class extends MangaToon {

    public constructor() {
        super('mangatoon-en', `MangaToon (English)`, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaToonEN extends MangaToon {

    constructor() {
        super();
        super.id = 'mangatoon-pt';
        super.label = 'MangaToon (Portuguese)';
        this.tags = [ 'webtoon', 'portuguese' ];
        this.url = 'https://mangatoon.mobi/pt';
        this.path = '/pt/genre?page=';
    }
}
*/