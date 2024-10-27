import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'kanman',
        title: '看漫画 (KanMan)'
    },
    container: {
        url: 'https://www.kanman.com/108632/',
        id: '108632',
        title: '龙腾战尊'
    },
    child: {
        id: 'yugao-1624325650020',
        title: '预告'
    },
    entry: {
        index: 0,
        size: 185_594,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();