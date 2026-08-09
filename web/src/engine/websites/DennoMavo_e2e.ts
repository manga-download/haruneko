import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dennomavo',
        title: 'Denno Mavo'
    },
    container: {
        url: 'https://mavo.takekuma.jp/title.php?title=65',
        id: '/title.php?title=65',
        title: '投稿マヴォ入選作品'
    },
    child: {
        id: '/viewer.php?id=1543',
        title: '恐怖のプリマドンナ'
    },
    entry: {
        index: 0,
        size: 235_467,
        type: 'image/jpeg'
    }
}).AssertWebsite();