import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'kaktustoon',
        title: 'KaktusToon',
    },
    container: {
        url: 'https://kaktustoon.com/pt/anime/eu-realmente-nao-quero-aprender-feiticos-proibidos',
        id: 'eu-realmente-nao-quero-aprender-feiticos-proibidos',
        title: 'Eu Realmente Não Quero Aprender Feitiços Proibidos'
    },
    child: {
        id: 'capitulo-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 3_926_092,
        type: 'image/png'
    }
}).AssertWebsite();