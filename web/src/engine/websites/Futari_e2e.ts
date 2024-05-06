import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'futari',
        title: 'Futari'
    },
    container: {
        url: 'https://futari.info/manga/torima-minshuku-yadori-teki-na/',
        id: '/manga/torima-minshuku-yadori-teki-na/',
        title: 'Torima Minshuku Yadori-teki na!'
    },
    child: {
        id: '/torima-minshuku-yadori-teki-na-chapter-04/',
        title: 'Chapter 4'
    },
    entry: {
        index: 1,
        size: 649_698,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());