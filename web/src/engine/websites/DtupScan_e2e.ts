import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'dtupscan',
        title: 'Dtup Scan'
    },
    container: {
        url: 'https://dtupscan.com/manga/llevo-mil-anos-atrapado-en-el-mismo-dia/',
        id: '/manga/llevo-mil-anos-atrapado-en-el-mismo-dia/',
        title: 'Llevo mil años atrapado en el mismo día'
    },
    child: {
        id: '/llevo-mil-anos-atrapado-en-el-mismo-dia-capitulo-1/',
        title: 'Capítulo 1',
    },
    entry: {
        index: 2,
        size: 302_177,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();