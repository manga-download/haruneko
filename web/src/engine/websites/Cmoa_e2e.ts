import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'cmoa',
        title: 'コミックシーモア (Cmoa)'
    },
    container: {
        url: 'https://www.cmoa.jp/title/151961/vol/24/',
        id: '/title/151961/',
        title: '呪術廻戦'
    },
    child: {
        id: '/bib/speedreader/?cid=0000151961_jp_0021&u0=1&u1=0',
        title: '呪術廻戦 21'
    },
    entry: {
        index: 0,
        size: 2_880_733,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();