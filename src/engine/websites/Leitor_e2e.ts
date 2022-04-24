import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'leitor',
        title: 'Leitor'
    },
    // Geo-blocked (Region: Brazil)
    /*
    container: {
        url: '',
        id: '',
        title: ''
    },
    child: {
        id: '',
        title: ''
    },
    entry: {
        index: 0,
        size: -1,
        type: ''
    }
    */
};

const fixture = new TestFixture(config);
describe(config.plugin.title, () => fixture.AssertWebsite());