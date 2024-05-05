import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'turktoon',
        title: 'Turktoon'
    },
    container: {
        url: 'https://turktoon.com/manga/martial-peak/',
        id: '/manga/martial-peak/',
        title: 'Martial Peak'
    },
    child: {
        id: '/martial-peak-1/',
        title: 'Bölüm 1 -'
    },
    entry: {
        index: 0,
        size: 401_710,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());