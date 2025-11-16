import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: English Chapter
new TestFixture({
    plugin: {
        id: 'weebdex',
        title: 'WeebDex'
    },
    container: {
        url: 'https://weebdex.org/title/o45hnurgz7/yu-gi-oh-go-rush',
        id: 'o45hnurgz7',
        title: 'Yu-Gi-Oh! Go Rush!!'
    },
    child: {
        id: 'ypasjpztxy',
        title: 'Vol. 2 Ch. 10 - Rovian Touzokudan (en)'
    },
    entry: {
        index: 0,
        size: 297_899,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: English Oneshot
new TestFixture({
    plugin: {
        id: 'weebdex',
        title: 'WeebDex'
    },
    container: {
        url: 'https://weebdex.org/title/rnw5u54ptn/a-girl-with-abnormally-sensitive-ears',
        id: 'rnw5u54ptn',
        title: 'A Girl With Abnormally Sensitive Ears'
    },
    child: {
        id: 'grrm4af4eq',
        title: 'Oneshot (en)'
    },
    entry: {
        index: 0,
        size: 568_618,
        type: 'image/png'
    }
}).AssertWebsite();