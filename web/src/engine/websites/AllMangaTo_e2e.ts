import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'allmangato',
        title: 'AllManga.to'
    },
    container: {
        url: 'https://allmanga.to/manga/kFvrdRcbubPjrhr63/yuan-zun',
        id: 'kFvrdRcbubPjrhr63',
        title: 'Yuan Zun'
    },
    child: {
        id: JSON.stringify({id: '643.5', translation: 'sub'}),
        title: 'Chapter 643.5 [sub]'
    },
    entry: {
        index: 0,
        size: 175_254,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();