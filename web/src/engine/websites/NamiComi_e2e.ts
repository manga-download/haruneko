import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Chapter
new TestFixture({
    plugin: {
        id: 'namicomi',
        title: 'NamiComi'
    },
    container: {
        url: 'https://namicomi.com/en/title/SbrnAkma/legacy-of-a-fighter',
        id: 'SbrnAkma',
        title: 'Legacy Of A Fighter'
    },
    child: {
        id: 'UN8qSLhu',
        title: 'Chapter 2.3 Cursed (Part 3) [en]'
    },
    entry: {
        index: 0,
        size: 1_492_297,
        type: 'image/png'
    }
}).AssertWebsite();

// CASE: Oneshot
new TestFixture({
    plugin: {
        id: 'namicomi',
        title: 'NamiComi'
    },
    container: {
        url: 'https://namicomi.com/en/title/XKeExjvD/lifesteal',
        id: 'XKeExjvD',
        title: 'LIFESTEAL - ONESHOT'
    },
    child: {
        id: 'CguiKcL9',
        title: 'Oneshot [en]'
    },
    entry: {
        index: 1,
        size: 1_503_965,
        type: 'image/png'
    }
}).AssertWebsite();