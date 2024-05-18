import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'namicomi',
        title: 'NamiComi'
    },
    container: {
        url: 'https://namicomi.com/en/title/SbrnAkma/legacy-of-a-fighter',
        id: 'SbrnAkma',
        title: 'Legacy Of A Fighter'
    },
    child: {
        id: 'UN8qSLhu',
        title: '2.3 Cursed (Part 3) [en]'
    },
    entry: {
        index: 0,
        size: 1_492_297,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());