import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'yanmaga',
        title: 'Yanmaga'
    },
    container: {
        url: 'https://yanmaga.jp/comics/%E5%A4%A2%E3%81%86%E3%81%A4%E3%81%A4%E3%81%AE%E8%8A%B1%E3%81%AE%E5%9C%92',
        id: '/comics/%E5%A4%A2%E3%81%86%E3%81%A4%E3%81%A4%E3%81%AE%E8%8A%B1%E3%81%AE%E5%9C%92',
        title: '夢うつつの花の園',
    },
    child: {
        id: '/comics/%E5%A4%A2%E3%81%86%E3%81%A4%E3%81%A4%E3%81%AE%E8%8A%B1%E3%81%AE%E5%9C%92/351192c0f7d1cf3b88175f3d9dfae594',
        title: '第１夢　幽体離脱'
    },
    entry: {
        index: 0,
        size: 2_088_305,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();