import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'webtoontr',
        title: 'WebtoonTR',
    },
    container: {
        url: 'https://webtoontr.com/_/dragons-son-changsik',
        id: '/_/dragons-son-changsik',
        title: 'Dragon\'s Son Changsik'
    },
    child: {
        id: '/_/dragons-son-changsik/6',
        title: '6'
    },
    entry: {
        index: 0,
        size: 144_497,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();