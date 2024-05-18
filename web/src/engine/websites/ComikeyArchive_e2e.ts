import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'comikey-archive',
        title: 'Comikey (Archive)'
    },
    container: {
        url: 'https://comikey.ovh/read/kengan-ashura-manga/',
        id: 'kengan-ashura-manga',
        title: 'Kengan Ashura'
    },
    child: {
        id: 'onlKWD/chapter-1',
        title: 'Chapter 1 - Asura'
    },
    entry: {
        index: 0,
        size: 1_219_237,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());