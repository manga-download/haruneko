import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'neumanga',
        title: 'NeuManga'
    },
    container: {
        url: 'https://neumanga.net/series/cultivation-return-on-campus/',
        id: '/series/cultivation-return-on-campus/',
        title: 'Cultivation Return on Campus'
    },
    child: {
        id: '/cultivation-return-on-campus-chapter-439-bahasa-indonesia/',
        title: 'Chapter 439'
    },
    entry: {
        index: 0,
        size: 901_328,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());