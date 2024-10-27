import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'manhwafullnet',
        title: 'ManhwaFull(.Net)'
    },
    container: {
        url: 'https://manhwafull.net/ancient-gods-chosen-warriors/',
        id: '/ancient-gods-chosen-warriors/',
        title: 'Ancient God’s Chosen Warriors'
    },
    child: {
        id: '/ancient-gods-chosen-warriors-chapter-42',
        title: 'Chapter 42'
    },
    entry: {
        index: 0,
        size: 87_738,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();