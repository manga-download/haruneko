import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hentaidatia',
        title: 'Hentai da Tia',
    },
    container: {
        url: 'https://hentaidatia.com/baricare-a-sra-kaa-foi-seduzida-por-um-delinquente-vol-1/',
        id: '/baricare-a-sra-kaa-foi-seduzida-por-um-delinquente-vol-1/',
        title: 'BariCare: A Sra. Kaa foi seduzida por um delinquente, Vol. 1'
    },
    child: {
        id: '/baricare-a-sra-kaa-foi-seduzida-por-um-delinquente-vol-1/',
        title: 'BariCare: A Sra. Kaa foi seduzida por um delinquente, Vol. 1'
    },
    entry: {
        index: 0,
        size: 230_442,
        type: 'image/webp'
    }
}).AssertWebsite();