import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'yaoiscanfr',
        title: 'YaoiScanFR'
    },
    container: {
        url: 'https://yaoiscan.fr/catalogue/no-love-zone-version-officielle/',
        id: '/catalogue/no-love-zone-version-officielle/',
        title: 'No Love Zone [Version officielle]'
    },
    child: {
        id: '/no-love-zone-version-officielle-chapter-85/',
        title: 'Chapitre 85'
    },
    entry: {
        index: 0,
        size: 197_894,
        type: 'image/webp'
    }
}).AssertWebsite();