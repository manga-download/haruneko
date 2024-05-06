import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'alliedfansub',
        title: 'Allied Fansub'
    },
    container: {
        url: 'https://alliedfansub.net/manga/the-priest-dreaming-of-a-dragon/',
        id: JSON.stringify({ post: '57188', slug: '/manga/the-priest-dreaming-of-a-dragon/'}),
        title: 'The Priest Dreaming of a Dragon'
    },
    child: {
        id: '/manga/the-priest-dreaming-of-a-dragon/bolum-4/',
        title: 'Bölüm 4'
    },
    entry: {
        index: 2,
        size: 312_620,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());