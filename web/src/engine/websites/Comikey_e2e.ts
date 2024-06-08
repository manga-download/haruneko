import { describe } from 'vitest';
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
        index: 0,
        size: 947_276,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());