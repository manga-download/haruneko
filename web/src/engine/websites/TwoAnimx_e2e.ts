import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: '2animx',
        title: '2Animx'
    },
    container: {
        url: 'https://www.2animx.com/index-comic-name-古惑仔-id-254',
        id: encodeURI('/index-comic-name-古惑仔-id-254'),
        title: '古惑仔'
    },
    child: {
        id: encodeURI('/index-look-name-古惑仔-cid-254-id-582690'),
        title: '第2331回 腰斬陳浩南'
    },
    entry: {
        index: 0,
        size: 124_452,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());