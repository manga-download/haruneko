import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gaiatoon',
        title: 'GaiaToon'
    },
    container: {
        url: 'https://gaiatoon.com/manga/defend-the-rose/',
        id: '/manga/defend-the-rose/',
        title: 'Defend the Rose'
    },
    child: {
        id: '/defend-the-rose-bolum-9-final/',
        title: 'Bölüm 9 - Final'
    },
    entry: {
        index: 1,
        size: 2_473_987,
        type: 'image/png'
    }
};

new TestFixture(config).AssertWebsite();