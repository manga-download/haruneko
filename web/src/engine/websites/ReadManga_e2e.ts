import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'readmanga',
        title: 'ReadManga'
    },
    container: {
        url: 'https://readmanga.live/tomo_tian___devushka_',
        id: '/tomo_tian___devushka_',
        title: 'Томо-тян — девушка!'
    },
    child: {
        id: '/tomo_tian___devushka_/vol8/951.6',
        title: '8 Экстра'
    },
    entry: {
        index: 0,
        size: 271_227,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());