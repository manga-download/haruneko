import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'manga33',
        title: 'Manga33'
    },
    container: {
        url: 'https://www.manga333.com/manga/black-clover.html',
        id: '/manga/black-clover.html',
        title: 'Black Clover'
    },
    child: {
        id: '/manga/black-clover-368-all.html',
        title: 'Chapter 368'
    },
    entry: {
        index: 0,
        size: 516_711,
        type: 'image/jpeg',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());