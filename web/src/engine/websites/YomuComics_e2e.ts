import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yomucomics',
        title: 'Yomu Comics',
    },
    container: {
        url: 'https://yomu.com.br/obra/a-31-peca-que-virou-o-tabuleiro',
        id: 'a-31-peca-que-virou-o-tabuleiro',
        title: 'A 31ª Peça Que virou o Tabuleiro',
    },
    child: {
        id: 'cmm0v5ql600a1vo6oe75844y9',
        title: 'CAPÍTULO 101 - Capítulo 101',
    },
    entry: {
        index: 0,
        size: 1_970_702,
        type: 'image/webp',
    }
}).AssertWebsite();