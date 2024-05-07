import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'komikindoinfo',
        title: 'KomikindoInfo'
    },
    container: {
        url: 'https://komikindo.info/series/beauty-in-a-click/',
        id: '/series/beauty-in-a-click/',
        title: 'Beauty in a Click'
    },
    child: {
        id: '/beauty-in-a-click-chapter-65-2/',
        title: 'Chapter 65.2'
    },
    entry: {
        index: 1,
        size: 124_664,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());