import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: '8muses',
        title: '8 MUSES'
    },
    container: {
        url: 'https://comics.8muses.com/comics/album/ZZZ-Comics/Sizeable-Tales',
        id: '/comics/album/ZZZ-Comics/Sizeable-Tales',
        title: 'Sizeable Tales'
    },
    child: {
        id: '/comics/album/ZZZ-Comics/Sizeable-Tales/Issue-1',
        title: 'Issue 1'
    },
    entry: {
        index: 0,
        size: 499_246,
        type: 'image/jpeg'
    }
}).AssertWebsite();