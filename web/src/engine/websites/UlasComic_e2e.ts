import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ulascomic',
        title: 'Ulas Comic',
    },
    container: {
        url: 'https://www.ulascomic00.xyz/2024/05/god-of-blackfield.html',
        id: '/2024/05/god-of-blackfield.html',
        title: 'God Of Blackfield',
    },
    child: {
        id: `/2024/05/chapter-01.html`,
        title: 'Chapter 01',
    },
    entry: {
        index: 0,
        size: 747_486,
        type: 'image/webp'
    }
}).AssertWebsite();