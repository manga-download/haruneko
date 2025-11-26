import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
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
}).AssertWebsite();