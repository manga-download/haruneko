import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'ulascomic',
        title: 'Ulas Comic',
    },
    container: {
        url: 'https://www.ulascomic.xyz/2024/05/god-of-blackfield.html',
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
};

new TestFixture(config).AssertWebsite();