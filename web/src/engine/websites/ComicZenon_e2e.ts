import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comiczenon',
        title: 'ゼノン編集部 (Comic Zenon)'
    },
    container: {
        url: 'https://comic-zenon.com/episode/4856001361427456223',
        id: '/episode/4856001361427456223',
        title: '常識知らずの最強魔導師'
    },
    child: {
        id: '/episode/4856001361588782671',
        title: '第3話'
    },
    entry: {
        index: 0,
        size: 1_756_348,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());