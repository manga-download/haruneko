import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentailib',
        title: 'HentaiLib'
    },
    container: {
        url: 'https://hentailib.me/ru/manga/206329--seteueob',
        id: '206329--seteueob',
        title: 'Подача'
    }, /* need login
    child: {
        id: './manga/206329--seteueob/chapter?volume=1&number=75',
        title: '75'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/webp'
    }*/
}).AssertWebsite();