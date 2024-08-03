import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'drecomics',
        title: 'DRE Comics'
    },
    container: {
        url: 'https://drecom-media.jp/drecomics/series/kakuresaijo',
        id: '/drecomics/series/kakuresaijo',
        title: '隠れ才女は全然めげない'
    },
    child: {
        id: '/viewer/e/257',
        title: '第7話②'
    },
    entry: {
        index: 0,
        size: 1_698_814,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());