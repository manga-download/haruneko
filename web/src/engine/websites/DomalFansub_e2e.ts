import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'domalfansub',
        title: 'Domal Fansub'
    },
    container: {
        url: 'https://domalfansub.com.tr/manga/code-of-silence/',
        id: JSON.stringify({ post: '5675', slug: '/manga/code-of-silence/'}),
        title: 'Code of Silence'
    },
    child: {
        id: '/manga/code-of-silence/52-bolum/',
        title: '52. Bölüm'
    },
    entry: {
        index: 0,
        size: 959_821,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());