import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'grabberzone',
        title: 'Grabber Zone'
    },
    container: {
        url: 'https://grabber.zone/comics/songs-of-silver/',
        id: JSON.stringify({ post: '7901', slug: '/comics/songs-of-silver/' }),
        title: 'Songs of Silver'
    },
    child: {
        id: '/comics/songs-of-silver/chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_330_429,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();