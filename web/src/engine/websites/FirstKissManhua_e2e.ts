import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: '1stkissmanhua',
        title: '1st Kiss Manhua'
    },
    container: {
        url: encodeURI('https://1stkissmanhua.com/manga/blank。/').toLocaleLowerCase(),
        id: JSON.stringify({ post: '91431', slug: encodeURI('/manga/blank。/').toLocaleLowerCase(), }),
        title: '[ blank。]'
    },
    child: {
        id: encodeURI('/manga/blank。/chapter-0/').toLocaleLowerCase(),
        title: 'Chapter 0'
    },
    entry: {
        index: 0,
        size: 11_488,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());