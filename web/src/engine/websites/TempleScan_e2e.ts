import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
};

new TestFixture(config).AssertWebsite();