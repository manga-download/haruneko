import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manhuadex',
        title: 'ManHuaDex'
    },
    container: {
        url: 'https://manhuadex.com/manga/tales-of-demons-and-gods/',
        id: JSON.stringify({ post: '4605', slug: '/manga/tales-of-demons-and-gods/' }),
        title: 'Tales of Demons and Gods'
    },
    child: {
        id: '/manga/tales-of-demons-and-gods/chapter-442-6/',
        title: 'Chapter 442.6'
    },
    entry: {
        index: 1,
        size: 99_412,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());