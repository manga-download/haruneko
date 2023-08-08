import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'fmteam',
        title: 'FMTeam'
    },
    container: {
        url: 'https://fmteam.fr/comics/dgray-man',
        id: 'dgray-man' ,
        title: 'D.Gray-man'
    },
    child: {
        id: '/read/dgray-man/fr/ch/248',
        title: 'Nuit 248 : Adieux à A.W. - Contact'
    },
    entry: {
        index: 1,
        size: 722_069,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());