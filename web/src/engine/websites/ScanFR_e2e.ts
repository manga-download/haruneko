import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scanfr',
        title: 'Scan FR'
    },
    container: {
        url: 'https://www.scan-fr.org/manga/-12-love',
        id: '/manga/-12-love',
        title: '1/2 Love!'
    },
    child: {
        id: '/manga/-12-love/3.5',
        title: '3.5'
    },
    entry: {
        index: 0,
        size: 183_582,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());