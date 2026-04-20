import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'softkomik',
        title: 'Softkomik'
    },
    container: {
        url: 'https://softkomik.co/black-abyss-at-dawn-bahasa-indonesia',
        id: 'black-abyss-at-dawn-bahasa-indonesia',
        title: 'Black Abyss at Dawn'
    },
    child: {
        id: '/black-abyss-at-dawn-bahasa-indonesia/chapter/028',
        title: 'Chapter 28'
    },
    entry: {
        index: 1,
        size: 348_548,
        type: 'image/jpeg'
    }
}).AssertWebsite();