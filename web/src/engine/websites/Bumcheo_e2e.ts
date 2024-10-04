import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'bumcheo',
        title: 'Bumcheo',
        timeout: 15000
    },
    container: {
        url: 'https://bumcheo.vn/comic/series?id=1ttMqISFD9N0',
        id: '1ttMqISFD9N0',
        title: 'Blue Archive!(Global)',
        timeout: 15000
    },
    child: {
        id: '1',
        title: 'Chap 1: Một ngày ở hội bàn bạc kế sách!',
    },
    entry: {
        index: 1,
        size: 238_408,
        type: 'image/jpeg',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
