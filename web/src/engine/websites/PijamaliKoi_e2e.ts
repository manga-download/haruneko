import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'pijamalikoi',
        title: 'Pijamalı Koi'
    },
    container: {
        url: 'https://pijamalikoi.com/m/seri/akatsuki-no-yona/',
        id: '/m/seri/akatsuki-no-yona/',
        title: 'Akatsuki no Yona'
    },
    child: {
        id: '/m/akatsuki-no-yona-47-bolum/',
        title: 'Bölüm 47'
    },
    entry: {
        index: 3,
        size: 379_999,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());