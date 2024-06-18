import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'ichijin-plus',
        title: '一迅プラス (Ichijin Plus)'
    },
    container: {
        url: 'https://ichijin-plus.com/comics/2408795783205',
        id: '2408795783205',
        title: '大室家'
    },
    child: {
        id: '2886942130261',
        title: '第1話'
    },
    entry: {
        index: 0,
        size: 775_530,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());