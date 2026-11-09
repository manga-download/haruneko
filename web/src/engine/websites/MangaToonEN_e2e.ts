import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-en',
        title: 'MangaToon (English)',
    },
    container: {
        url: 'https://mangatoon.mobi/en/cruel-love?content_id=546539',
        id: '546539',
        title: 'Cruel Love'
    },
    child: {
        id: '79323',
        title: 'Episode 1'
    },
    entry: {
        index: 0,
        size: 120_452,
        type: 'image/webp'
    }
}).AssertWebsite();