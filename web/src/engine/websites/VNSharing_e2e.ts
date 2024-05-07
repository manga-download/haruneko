import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'vnsharing',
        title: 'VNSharing'
    },
    container: {
        url: 'https://truyen.vnsharing.site/index/read/1092/0/Mikami_to_Sato_wa_Mada_Yamashikunai__',
        id: '/index/read/1092/0/Mikami_to_Sato_wa_Mada_Yamashikunai__',
        title: 'Mikami to Sato wa Mada Yamashikunai'
    },
    child: {
        id: '/index/read/1092/10870/Mikami_to_Sato_wa_Mada_Yamashikunai___-_001',
        title: '001'
    },
    entry: {
        index: 0,
        size: 80_545,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());