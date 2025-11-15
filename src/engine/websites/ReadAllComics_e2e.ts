import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'readallcomics',
        title: 'ReadAllComics'
    },
    container: {
        url: 'https://readallcomics.com/category/frank-frazettas-death-dealer-opus-comics/',
        id: '/category/frank-frazettas-death-dealer-opus-comics/',
        title: 'Frank Frazetta’s Death Dealer'
    },
    child: {
        id: '/frank-frazettas-death-dealer-01-2022/',
        title: '01 (2022)'
    },
    entry: {
        index: 1,
        size: 1_756_730,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();