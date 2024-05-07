import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'mangareader',
        title: 'MangaReader'
    },
    container: {
        url: 'https://mangareader.tv/manga/manga-of991740',
        id: '/manga/manga-of991740',
        title: 'Hinata No Blue'
    },
    child: {
        id: '/chapter/manga-of991740/chapter-1',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 204_695,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());