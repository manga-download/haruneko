import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scansmangas',
        title: 'ScansMangas'
    }
    // Geo-blocked (Region: France?), or maybe website is broken
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
describe(fixture.Name, () => fixture.AssertWebsite());