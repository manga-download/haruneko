import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'seimanga',
        title: 'SeiManga'
    },
    container: {
        url: 'https://seimanga.me/sword_art_online__progressiv___skerco_glubokoi_nochi/',
        id: '/sword_art_online__progressiv___skerco_glubokoi_nochi/',
        title: 'Sword Art Online: Progressive - Kuraki Yuuyami no Scherzo',
    },
    child: {
        id: '/sword_art_online__progressiv___skerco_glubokoi_nochi/vol3/19',
        title: '3 - 19 Эпилог',
    },
    entry: {
        index: 0,
        size: 472_438,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());