﻿import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comico',
        title: 'Comico (コミコ)'
    },
    container: {
        url: 'https://comico.jp/comic/9331',
        id: '/comic/9331',
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
describe(fixture.Name, () => fixture.AssertWebsite());