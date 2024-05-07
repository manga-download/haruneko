import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'seinagifansub-en',
        title: 'SeinagiFansub (EN)'
    },
    container: {
        url: 'https://reader.seinagi.org.es/series/sakura_sakura_morishige/',
        id: '/series/sakura_sakura_morishige/',
        title: 'Sakura Sakura (Morishige)'
    },
    child: {
        id: '/read/sakura_sakura_morishige/en/0/1/',
        title: 'Chapter 1: Sakura Blooms'
    },
    entry: {
        index: 1,
        size: 318_406,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());