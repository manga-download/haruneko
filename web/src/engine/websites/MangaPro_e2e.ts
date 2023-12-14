import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangapro',
        title: 'Manga Pro'
    },
    container: {
        url: 'https://mangapro.co/manga/i-eat-soft-rice-in-another-world/',
        id: '/manga/i-eat-soft-rice-in-another-world/',
        title: 'I Eat Soft Rice In Another World'
    },
    child: {
        id: '/3k6hrp/',
        title: 'الفصل 0',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 2_728_927,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());