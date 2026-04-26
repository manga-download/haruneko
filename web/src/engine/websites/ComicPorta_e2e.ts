import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comicporta',
        title: 'COMICポルタ (Comic Porta)'
    },
    container: {
        url: 'https://comic-porta.com/series/124/',
        id: '/series/124/',
        title: 'モスのいる日常'
    },
    child: {
        id: '/p_data/moth001/',
        title: '１話「モスとの出会い」'
    },
    entry: {
        index: 0,
        size: 1_558_004,
        type: 'image/png',
        timeout: 20000
    }
}).AssertWebsite();