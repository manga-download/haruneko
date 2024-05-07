import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'arabtoons',
        title: 'ArabToons'
    },
    container: {
        url: 'https://arabtoons.net/manga/elf-who-likes-to-be-humiliated/',
        id: JSON.stringify({ post: '6109', slug: '/manga/elf-who-likes-to-be-humiliated/' }),
        title: 'Elf Who Likes To Be Humiliated'
    },
    child: {
        id: '/manga/elf-who-likes-to-be-humiliated/%d8%a7%d9%84%d9%81%d8%b5%d9%84-71/',
        title: 'الفصل 71'
    },
    entry: {
        index: 0,
        size: 552_313,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());