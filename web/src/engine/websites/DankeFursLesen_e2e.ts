import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'dankefurslesen',
        title: 'Danke fürs Lesen'
    },
    container: {
        url: 'https://danke.moe/read/manga/female-knight-and-kemonomimi-child/',
        id: 'female-knight-and-kemonomimi-child',
        title: 'Female Knight and the Kemonomimi Child'
    },
    child: {
        id: '16',
        title: 'Chapter 16 - Roaming Skeletons'
    },
    entry: {
        index: 0,
        size: 1_046_281,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());