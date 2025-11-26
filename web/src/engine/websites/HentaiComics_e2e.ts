import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentaicomics',
        title: 'HentaiComics',
    },
    container: {
        url: 'https://hentaicomics.biz/preto-e-branco/spy-x-family-hentai/',
        id: '/preto-e-branco/spy-x-family-hentai/',
        title: 'Spy × Family'
    },
    child: {
        id: '/preto-e-branco/spy-x-family-hentai/',
        title: 'Spy × Family'
    },
    entry: {
        index: 0,
        size: 116_926,
        type: 'image/webp'
    }
}).AssertWebsite();