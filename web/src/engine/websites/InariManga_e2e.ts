import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'inarimanga',
        title: 'InariManga',
    },
    container: {
        url: 'https://inarimanga.yofast.xyz/series/reembolsare-la-bondad-con-la-que-me-criaron-con-obsesion/',
        id: '/series/reembolsare-la-bondad-con-la-que-me-criaron-con-obsesion/',
        title: 'Reembolsaré La Bondad Con La Que Me Criaron Con Obsesión'
    },
    child: {
        id: '/series/reembolsare-la-bondad-con-la-que-me-criaron-con-obsesion/capitulo-20/',
        title: 'Capitulo 20'
    },
    entry: {
        index: 1,
        size: 463_462,
        type: 'image/webp'
    }
}).AssertWebsite();