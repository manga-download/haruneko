import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'demonsect',
        title: 'Demon Sect',
        //timeout: 25000
    },
    container: {
        url: 'https://demonsect.com.br/comics/antigo-soberano-da-eternidade/',
        id: JSON.stringify({ post: '118', slug: '/comics/antigo-soberano-da-eternidade/' }),
        title: 'Antigo Soberano da Eternidade',
        //timeout: 30000
    },
    child: {
        id: '/comics/antigo-soberano-da-eternidade/cap-242/',
        title: 'CAP. 242',
        //timeout: 25000
    },
    entry: {
        index: 1,
        size: 1_494_289,
        type: 'image/jpeg',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());