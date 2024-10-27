import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangayaro',
        title: 'Mangayaro'
    },
    container: {
        url: 'https://www.nowheartruth.com/manga/surviving-as-a-tyrants-daughter/',
        id: '/manga/surviving-as-a-tyrants-daughter/',
        title: `Surviving as a Tyrant’s Daughter`
    },
    child: {
        id: '/surviving-as-a-tyrants-daughter-chapter-01-bahasa-indonesia/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 978_171,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();