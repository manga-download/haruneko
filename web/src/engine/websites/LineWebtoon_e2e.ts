import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'linewebtoon',
        title: 'Line Webtoon',
    },
    container: {
        url: 'https://www.webtoons.com/en/romance/lore-olympus/list?title_no=1320',
        id: '/en/romance/lore-olympus/list?title_no=1320',
        title: 'Lore Olympus',
        timeout: 15000
    },
    child: {
        id: '/en/romance/lore-olympus/s3-episode-250/viewer?title_no=1320&episode_no=255',
        title: '#255 - (S3) Episode 250',
        timeout: 20000
    },
    entry: {
        index: 1,
        size: 39_553,
        type: 'image/jpeg',
    }
};

new TestFixture(config).AssertWebsite();