import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'galaxymanga',
        title: 'Galaxy Manga'
    },
    container: {
        url: 'https://flixscans.com/series/98504-101-betrayal-of-dignity',
        id: JSON.stringify({ id: 101, prefix: 98504 }),
        title: 'Betrayal of Dignity'
    },
    child: {
        id: '13351',
        title: '40'
    },
    entry: {
        index: 0,
        size: 341_024,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());