import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comikey',
        title: 'Comikey'
    },
    container: {
        url: 'https://comikey.com/comics/strike-it-rich-manga/534/',
        id: '/comics/strike-it-rich-manga/534/',
        title: 'ST☆R: Strike it Rich'
    },
    child: {
        id: '/read/strike-it-rich-manga/DObVlk/chapter-0',
        title: 'Chapter 0 - Time for a Revolution ✰'
    },
    entry: {
        index: 4,
        size: 655_443,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();