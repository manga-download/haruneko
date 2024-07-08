import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'genztoon',
        title: 'GenzToon'
    },
    container: {
        url: 'https://genztoons.com/manga/a-bad-person/',
        id: '/manga/a-bad-person/',
        title: 'A Bad Person'
    },
    child: {
        id: '/a-bad-person-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 251_168,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());