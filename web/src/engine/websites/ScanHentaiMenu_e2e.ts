import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'scanhentaimenu',
        title: 'ScanHentaiMenu'
    },
    /* CloudFlare
    container: {
        url: 'https://scan.hentai.menu/manga/konna-elf-ni-you-wa-nai/',
        id: JSON.stringify({ post: '4237', slug: '/manga/konna-elf-ni-you-wa-nai/' }),
        title: 'Konna Elf ni You wa Nai'
    },
    child: {
        id: '/manga/konna-elf-ni-you-wa-nai/chapitre-7/',
        title: 'Chapitre 7'
    },
    entry: {
        index: 0,
        size: 613_473,
        type: 'image/jpeg'
    }
    */
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());