import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hastateamddt',
        title: 'Hasta Team DDT'
    },
    container: {
        url: 'https://ddt.hastateam.com/comics/wombs',
        id: 'wombs',
        title: 'Wombs'
    },
    child: {
        id: '/read/wombs/it/vol/1/ch/0/sub/0',
        title: 'Vol.1'
    },
    entry: {
        index: 1,
        size: 128_859,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();