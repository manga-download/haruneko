import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yomucomics',
        title: 'Yomu Comics',
    }, /* Nothing works without login
    container: {
        url: 'https://yomu.com.br/obra/a-31-peca-que-virou-o-tabuleiro',
        id: '88',
        title: 'A 31ª Peça Que virou o Tabuleiro',
    },
    child: {
        id: '01',
        title: 'Capítulo 01',
    },
    entry: {
        index: 2,
        size: 3_381_681,
        type: 'image/jpeg',
    }*/
}).AssertWebsite();