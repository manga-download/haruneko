import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'desirescans',
        title: 'Desire Scans'
    },
    container: {
        url: 'https://desirescans.com/series/comic/dead-or-alive',
        id: '/series/comic/dead-or-alive',
        title: 'Dead or Alive'
    },
    child: {
        id: '/series/comic/dead-or-alive/chapter/1',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 272_738,
        type: 'image/webp'
    }
}).AssertWebsite();