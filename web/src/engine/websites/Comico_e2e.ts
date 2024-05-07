import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comico',
        title: 'Comico (コミコ)'
    },
    container: {
        url: 'https://www.comico.jp/comic/9331',
        id: JSON.stringify({ id: '/comic/9331', lang: 'ja-JP' }),
        title: '生意気殿下の家庭教師になりました'
    },
    child: {
        id: '1',
        title: '第1話「傷物令嬢になりました」'
    },
    entry: {
        index: 0,
        size: 275_860,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());