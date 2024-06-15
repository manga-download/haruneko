import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'mangahot',
        title: 'マンガほっと (Manga Hot)'
    },
    container: {
        url: 'https://web.mangahot.jp/works/detail.php?work_code=h_R0012',
        id: 'h_R0012',
        title: 'フィルター越しのカノジョ 無修正版'
    },
    child: {
        id: '24859',
        title: '1.鉄壁と能面(1)',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 1_466_160,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());