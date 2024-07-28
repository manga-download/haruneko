import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hitomi',
        title: 'Hitomi'
    },
    container: {
        url: 'https://hitomi.la/manga/misshitsu-swimsuit-|-밀실-수영복-한국어-2995838.html#1',
        id: encodeURI('/manga/misshitsu-swimsuit-|-밀실-수영복-한국어-2995838.html'),
        title: 'Misshitsu Swimsuit | 밀실 수영복'
    },
    child: {
        id: encodeURI('/manga/misshitsu-swimsuit-|-밀실-수영복-한국어-2995838.html'),
        title: 'Misshitsu Swimsuit | 밀실 수영복'
    },
    entry: {
        index: 0,
        size: 375_444,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());