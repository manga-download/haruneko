import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comicvn',
        title: 'ComicVn'
    },
    container: {
        url: 'https://comicvn6.net/hoa-vo-co-su-671202ad7cbc225b837930e1.html',
        id: '/hoa-vo-co-su-671202ad7cbc225b837930e1.html',
        title: 'Hỏa Võ Cố Sự'
    },
    child: {
        id: '/hoa-vo-co-su/chapter-1-671205165502ed59626fc2c7.html',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 728_133,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();