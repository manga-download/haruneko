import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'turkmanga',
        title: 'TurkManga'
    },
    container: {
        url: 'https://turkmanga.com.tr/manga/mercenary-enrollment',
        id: '/manga/mercenary-enrollment',
        title: 'Mercenary Enrollment'
    },
    child: {
        id: 'bolum-1',
        title: 'Bölüm 0'
    },
    entry: {
        index: 0,
        size: 646_789,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());