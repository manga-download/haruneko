import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'nirvanamanga',
        title: 'NirvanaManga'
    },
    container: {
        url: 'https://nirvanamanga.com/manga/agla-hatta-yalvar/',
        id: '/manga/agla-hatta-yalvar/',
        title: 'Ağla, Hatta Yalvar'
    },
    child: {
        id: '/cry-even-better-if-you-beg-bolum-1/',
        title: 'Bölüm 1'
    },
    entry: {
        index: 0,
        size: 658_073,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());