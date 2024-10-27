import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'luascans',
        title: 'Lua Scans'
    },
    container: {
        url: 'https://luacomic.net/series/18012433589/',
        id: '/series/18012433589/',
        title: 'The Archvillain’s Daughter in Law'
    },
    child: {
        id: '/chapter/18012433589-8305e0d65cf/',
        title: 'Chapter 93'
    },
    entry: {
        index: 0,
        size: 749_437,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();