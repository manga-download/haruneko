import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mangatoon-id',
        title: 'MangaToon (Indonesian)',
    },
    container: {
        url: 'https://mangatoon.mobi/id/martial-arts-reigns?content_id=10615',
        id: '10615',
        title: 'Martial Arts Reigns'
    },
    child: {
        id: '27262',
        title: 'Episode 1'
    },
    entry: {
        index: 9,
        size: 8_172,
        type: 'image/webp'
    }
}).AssertWebsite();