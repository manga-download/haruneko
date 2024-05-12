import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'titanmanga',
        title: 'Titan Manga'
    },
    container: {
        url: 'https://titanmanga.com/manga/i-am-really-not-an-matchless-genius/',
        id: JSON.stringify({ post: '1854', slug: '/manga/i-am-really-not-an-matchless-genius/' }),
        title: 'I Am Really Not an Matchless Genius'
    },
    child: {
        id: '/manga/i-am-really-not-an-matchless-genius/bolum-20/',
        title: 'Bölüm 20'
    },
    entry: {
        index: 0,
        size: 3_171_682,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());