import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentaitokyo',
        title: 'Hentai Tokyo',
    },
    container: {
        url: 'https://hentaitokyo.net/apartamento-mal-assombrado/',
        id: '/apartamento-mal-assombrado/',
        title: 'Apartamento Mal-Assombrado'
    },
    child: {
        id: '/apartamento-mal-assombrado/',
        title: 'Apartamento Mal-Assombrado'
    },
    entry: {
        index: 0,
        size: 376_026,
        type: 'image/jpeg'
    }
}).AssertWebsite();