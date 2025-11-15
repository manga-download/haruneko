import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rumanhua',
        title: 'RuManhua'
    },
    container: {
        url: 'https://www.rumanhua.org/news/507050',
        id: '/news/507050',
        title: '纯情丫头火辣辣'
    },
    child: {
        id: '/show/oXKl3hlDG5.html',
        title: '第1话'
    },
    entry: {
        index: 1,
        size: 106_778,
        type: 'image/webp'
    }
}).AssertWebsite();