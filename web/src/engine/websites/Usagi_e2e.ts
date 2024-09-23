import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const configLongStrip: Config = {
    plugin: {
        id: 'usagi',
        title: 'Usagi'
    },
    container: {
        url: 'https://web.usagi.one/omniscient_reader_s_viewpoint',
        id: '/omniscient_reader_s_viewpoint',
        title: 'Всеведущий читатель'
    },
    child: {
        id: '/omniscient_reader_s_viewpoint/vol1/100',
        title: '1 - 100 То, что невозможно изменить - часть 2'
    },
    entry: {
        index: 0,
        size: 950_618,
        type: 'image/jpeg'
    }
};

const fixtureLongStrip = new TestFixture(configLongStrip);
describe(fixtureLongStrip.Name, async () => (await fixtureLongStrip.Connect()).AssertWebsite());

const configMultiPage: Config = {
    plugin: {
        id: 'usagi',
        title: 'Usagi'
    },
    container: {
        url: 'https://web.usagi.one/van_pis',
        id: '/van_pis',
        title: 'Ван Пис'
    },
    child: {
        id: '/van_pis/vol100/1010',
        title: '100 - 1010 Королевская воля'
    },
    entry: {
        index: 1,
        size: 554_563,
        type: 'image/png'
    }
};

const fixtureMultiPage = new TestFixture(configMultiPage);
describe(fixtureMultiPage.Name, async () => (await fixtureMultiPage.Connect()).AssertWebsite());