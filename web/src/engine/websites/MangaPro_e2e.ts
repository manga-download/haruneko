import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangapro',
        title: 'Manga Pro'
    },
    container: {
        url: 'https://promanga.pro/manga/i-eat-soft-rice-in-another-world/',
        id: '/manga/i-eat-soft-rice-in-another-world/',
        title: 'I Eat Soft Rice In Another World'
    },
    child: {
        id: '/i-eat-soft-rice-in-another-world-0/',
        title: 'الفصل 0',
    },
    entry: {
        index: 0,
        size: 2_728_927,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());