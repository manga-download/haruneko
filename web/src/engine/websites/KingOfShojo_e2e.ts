import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'kingofshojo',
        title: 'KingOfShojo'
    },
    container: {
        url: 'https://kingofshojo.com/manga/pure-love-operation/',
        id: '/manga/pure-love-operation/',
        title: 'Pure Love Operation',
    },
    child: {
        id: '/pure-love-operation-chapter-98/',
        title: 'Chapter 98'
    },
    entry: {
        index: 0,
        size: 267_413,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());