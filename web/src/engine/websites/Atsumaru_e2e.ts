import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'atsumaru',
        title: 'Atsumaru'
    },
    container: {
        url: 'https://atsu.moe/manga/2VgNt',
        id: '2VgNt',
        title: 'Witch Hat Atelier'
    },
    child: {
        id: 'BPtAZy',
        title: 'Chapter 99 [Gamma]'
    },
    entry: {
        index: 2,
        size: 293_743,
        type: 'image/avif'
    }
}).AssertWebsite();