import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'skymanga',
        title: 'Sky Manga'
    },
    container: {
        url: 'https://skymanga.work/manga/island-without-shadows',
        id: '/manga/island-without-shadows',
        title: 'Island Without Shadows'
    },
    child: {
        id: '/manga/island-without-shadows/chapter-1',
        title: '# Chapter 1'
    },
    entry: {
        index: 0,
        size: 796_973,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();