import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: '3hentai',
        title: '3Hentai'
    },
    container: {
        url: 'https://ru.3hentai.net/d/529276',
        id: '/d/529276',
        title: 'Administrator Privileges | Привилегии администратора'
    },
    child: {
        id: '/d/529276',
        title: 'Administrator Privileges | Привилегии администратора'
    },
    entry: {
        index: 0,
        size: 46_776,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());