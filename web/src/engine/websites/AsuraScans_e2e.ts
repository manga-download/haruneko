import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'asurascans',
        title: 'Asura Scans',
    },
    container: {
        url: 'https://asuracomic.net/series/dragon-devouring-mage-f4dac81c',
        id: '/series/dragon-devouring-mage-',
        title: 'Dragon-Devouring Mage',
    },
    child: {
        id: '/series/dragon-devouring-mage-/chapter/1',
        title: 'Chapter 1',
    },
    entry: {
        index: 1,
        size: 859_466,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());