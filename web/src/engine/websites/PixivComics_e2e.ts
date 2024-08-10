import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'pixivcomics',
        title: 'pixivコミック'
    },
    container: {
        url: 'https://comic.pixiv.net/works/9037',
        id: '9037',
        title: 'ダセェと言われた令嬢の華麗なる変身'
    },
    child: {
        id: '135724',
        title: '1話 - ダセェ田舎令嬢①'
    },
    entry: {
        index: 0,
        size: 678_371,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());