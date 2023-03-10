import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'firstkiss',
        title: '1st Kiss Manga'
    },
    container: {
        url: encodeURI('https://1stkissmanga.me/manga/blank。/').toLocaleLowerCase(),
        id: JSON.stringify({ post: '156052', slug: encodeURI('/manga/blank。/').toLocaleLowerCase(), }),
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
