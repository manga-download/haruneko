import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ravenscans',
        title: 'Raven Scans'
    },
    container: {
        url: 'https://ravenscans.com/manga/am-i-invincible/',
        id: '/manga/am-i-invincible/',
        title: 'Am I Invincible'
    },
    child: {
        id: '/am-i-invincible-chapter-chapter-176/',
        title: 'Chapter 176'
    },
    entry: {
        index: 1,
        size: 408_841,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();