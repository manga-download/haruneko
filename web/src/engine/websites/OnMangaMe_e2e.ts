import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'on-manga',
        title: 'مانجا اون لاين (On-Manga)'
    },
    container: {
        url: 'https://onma.me/manga/chainsaw-man',
        id: '/manga/chainsaw-man',
        title: 'Chainsaw Man'
    },
    child: {
        id: '/manga/chainsaw-man/127',
        title: '127 : أنقذ ال اسا'
    },
    entry: {
        index: 1,
        size: 767_631,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());