import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'inkstory',
        title: 'InkStory'
    },
    container: {
        url: 'https://inkstory.me/content/i-am-the-only-level-up',
        id: 'i-am-the-only-level-up',
        title: 'Поднятие уровня в одиночку'
    }, /* Need to be logged
    child: {
        id: 'f0f4abcc-0b94-4e01-b6ea-ef1be8bf4b9a',
        title: 'Том 1. Глава 1 (Novate)'
    },
    entry: {
        index: 1,
        size: 924_194,
        type: 'image/jpeg'
    }*/
}).AssertWebsite();