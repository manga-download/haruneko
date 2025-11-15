import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'coolmicfr',
        title: 'CoolMic (French)'
    },
    container: {
        url: 'https://fr.coolmic.me/titles/593',
        id: '/titles/593',
        title: `Les Secrets d'une star`
    },
    child: {
        id: '12369',
        title: '01'
    },
    entry: {
        index: 0,
        size: 274_377,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();