import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'lelscanvf',
        title: 'LELSCAN-VF'
    },
    container: {
        url: 'https://lelscanfr.com/manga/four-knights-of-the-apocalypse',
        id: '/manga/four-knights-of-the-apocalypse',
        title: 'Four Knights Of The Apocalypse',
        timeout: 15000
    },
    child: {
        id: '/manga/four-knights-of-the-apocalypse/144',
        title: 'Chapitre 144'
    },
    entry: {
        index: 0,
        size: 126_472,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());