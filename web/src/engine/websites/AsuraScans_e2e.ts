import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans',
    },
    container: {
        url: 'https://asuratoon.com/manga/0308950452-dragon-devouring-mage/',
        id: '/manga/0308950452-dragon-devouring-mage/',
        title: 'Dragon-Devouring Mage',
    },
    child: {
        id: '/4460228866-dragon-devouring-mage-1/',
        title: 'Chapter 1',
    },
    entry: {
        index: 1,
        size: 4_377_432,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());