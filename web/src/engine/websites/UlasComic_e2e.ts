import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ulascomic',
        title: 'Ulas Comic',
    },
    container: {
        url: 'https://www.ulascomic01.xyz/2024/05/god-of-blackfield.html',
        id: '/2024/05/god-of-blackfield.html',
        title: 'God Of Blackfield',
    },
    child: {
        id: '/2025/05/god-of-blackfield-chapter-273.html',
        title: 'Chapter 273',
    },
    entry: {
        index: 0,
        size: 303_394,
        type: 'image/jpeg'
    }
}).AssertWebsite();