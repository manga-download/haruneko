import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'rawdevart',
        title: 'RawDevart'
    },
    container: {
        url: 'https://rawdevart.art/kono-gomi-o-nanto-yobu-c23178',
        id: '23178',
        title: 'Kono Gomi o Nanto Yobu'
    },
    child: {
        id: '21',
        title: '21'
    },
    entry: {
        index: 0,
        size: 139_409,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();