import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fmteam',
        title: 'FMTeam'
    },
    container: {
        url: 'https://fmteam.fr/comics/dgray-man',
        id: 'dgray-man',
        title: 'D.Gray-man'
    },
    child: {
        id: '/read/dgray-man/fr/ch/251',
        title: `Nuit 251 : La librairie d'antiquités "Zeugle"`
    },
    entry: {
        index: 1,
        size: 1_743_016,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();