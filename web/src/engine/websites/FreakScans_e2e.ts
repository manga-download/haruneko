import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'freakscans',
        title: 'Freak Scans'
    },
    container: {
        url: 'https://freakscans.com/manga/dawn-of-the-predec1essor/',
        id: '/manga/dawn-of-the-predec1essor/',
        title: 'Dawn of the Predecessor'
    },
    child: {
        id: '/dawn-of-the-predecessor-ch-01/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 673_007,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());