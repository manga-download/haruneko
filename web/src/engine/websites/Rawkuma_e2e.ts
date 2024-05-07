import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'rawkuma',
        title: 'Rawkuma'
    },
    container: {
        url: 'https://rawkuma.com/manga/jujutsu-kaisen/',
        id: '/manga/jujutsu-kaisen/',
        title: 'Jujutsu Kaisen Raw'
    },
    child: {
        id: '/jujutsu-kaisen-chapter-1/',
        title: 'Chapter 1',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 158_262,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());