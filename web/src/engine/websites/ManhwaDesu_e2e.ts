import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'manhwadesu',
        title: 'ManhwaDesu',
    },
    container: {
        url: 'https://manhwadesu.tech/komik/sen-yen-de-oppai-misete/',
        id: '/komik/sen-yen-de-oppai-misete/',
        title: '〇sen-yen de Oppai Misete'
    },
    child: {
        id: '/sen-yen-de-oppai-misete-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 325_873,
        type: 'image/webp'
    }
}).AssertWebsite();