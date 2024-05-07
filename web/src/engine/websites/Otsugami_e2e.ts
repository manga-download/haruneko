import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'otsugami',
        title: 'Otsugami'
    },
    container: {
        url: 'https://otsugami.id/manga/mercenary-enrollment/',
        id: '/manga/mercenary-enrollment/',
        title: 'Mercenary Enrollment'
    },
    child: {
        id: '/mercenary-enrollment-chapter-165/',
        title: 'Chapter 165'
    },
    entry: {
        index: 0,
        size: 973_168,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());