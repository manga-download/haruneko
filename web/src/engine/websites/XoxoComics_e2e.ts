import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'xoxocomics',
        title: 'XoxoComics'
    },
    container: {
        url: 'https://xoxocomics.net/comic/marvel-knights-4',
        id: '/comic/marvel-knights-4' ,
        title: 'Marvel Knights 4'
    },
    child: {
        id: '/comic/marvel-knights-4/issue-30/68310/all',
        title: 'Issue #30'
    },
    entry: {
        index: 0,
        size: 556_085,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());