import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'wiemanga',
        title: 'WieManga'
    },
    container: {
        url: 'https://www.wiemanga.com/manga/Solo_Leveling.html',
        id: '/manga/Solo_Leveling.html' ,
        title: 'Solo Leveling',
    },
    child: {
        id: '/chapter/SoloLevelingVol2Ch140/450993/',
        title: 'Vol. 2 Ch. 140',
    },
    entry: {
        index: 0,
        size: 527_217,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());