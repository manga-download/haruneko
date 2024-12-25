import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hivescans',
        title: 'Hive Scans'
    },
    container: {
        url: 'https://hivetoon.com/series/maybe-meant-to-be-gjd9cwk3',
        id: JSON.stringify({ slug: 'maybe-meant-to-be-gjd9cwk3', id: '27' }),
        title: 'Maybe Meant to Be'
    },
    child: {
        id: '/series/maybe-meant-to-be-gjd9cwk3/chapter-93',
        title: '93'
    },
    entry: {
        index: 0,
        size: 501_034,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();