import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hentairead',
        title: 'HentaiRead'
    },
    container: {
        url: 'https://hentairead.com/hentai/maryoku-fusoku-de-gomen/',
        id: '/hentai/maryoku-fusoku-de-gomen/',
        title: 'Maryoku Fusoku de Gomen!'
    },
    child: {
        id: '/hentai/maryoku-fusoku-de-gomen/english/p/1/',
        title: 'Maryoku Fusoku de Gomen!'
    },
    entry: {
        index: 0,
        size: 546_393,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();