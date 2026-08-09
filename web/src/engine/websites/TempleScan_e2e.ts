import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : images as string[]
new TestFixture({
    plugin: {
        id: 'templescan',
        title: 'TempleScan'
    },
    container: {
        url: 'https://templetoons.com/comic/predatory-marriage-complete-edition',
        id: 'predatory-marriage-complete-edition',
        title: `Predatory Marriage (Complete Edition)`
    },
    child: {
        id: '22217-chapter-15',
        title: 'Chapter 15'
    },
    entry: {
        index: 0,
        size: 2_953_394,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE : images as {url: string;}[];
new TestFixture({
    plugin: {
        id: 'templescan',
        title: 'TempleScan'
    },
    container: {
        url: 'https://templetoons.com/comic/in-the-garden-of-may',
        id: 'in-the-garden-of-may',
        title: 'In The Garden of May'
    },
    child: {
        id: 'chapter-17',
        title: 'Chapter 17'
    },
    entry: {
        index: 6,
        size: 1_883_170,
        type: 'image/jpeg'
    }
}).AssertWebsite();