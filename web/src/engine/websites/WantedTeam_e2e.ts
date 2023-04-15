import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'wantedteam',
        title: 'Wanted Team',
    },
    container: {
        url: 'https://reader.onepiecenakama.pl/series/piraciop/',
        id: '/series/piraciop/',
        title: 'Piraci(OP)'
    },
    child: {
        id: '/read/piraciop/pl/105/1064/',
        title: 'Rozdział 1064: Labosfera Egghead'
    },
    entry: {
        index: 1,
        size: 674_791,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());