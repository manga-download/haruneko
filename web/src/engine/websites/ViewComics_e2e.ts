import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'viewcomics',
        title: 'ViewComics'
    },
    container: {
        url: 'https://viewcomics.org/comic/warhammer-40-000-defenders-of-ultramar',
        id: '/comic/warhammer-40-000-defenders-of-ultramar',
        title: 'Warhammer 40,000: Defenders of Ultramar'
    },
    child: {
        id: '/warhammer-40-000-defenders-of-ultramar/issue-4/full',
        title: 'Issue #4'
    },
    entry: {
        index: 0,
        size: 291_459,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());