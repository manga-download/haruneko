import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'webcomicsapp-en',
        title: 'WebComicsApp (English)',
    },
    container: {
        url: 'https://www.webcomicsapp.com/en/sci-fi/the-last-hero/60af57208c252b2d960bf732',
        id: '60af57208c252b2d960bf732',
        title: 'The Last Hero'
    },
    child: {
        id: '79d1e9685a4f970782c28939/1',
        title: 'Ch. 0 Prologue'
    },
    entry: {
        index: 0,
        size: 14_928,
        type: 'image/png'
    }
}).AssertWebsite();