import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'katakomik',
        title: 'Katakomik'
    },
    container: {
        url: 'https://katakomik.my.id/manga/shark/',
        id: '/manga/shark/',
        title: 'Shark'
    },
    child: {
        id: '/shark-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 299_718,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());