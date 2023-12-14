import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'demonsect',
        title: 'Demon Sect',
        timeout: 25000

    },
    container: {
        url: 'https://demonsect.com.br/manga/sob3ran0/',
        id: JSON.stringify({ post: '254', slug: '/manga/sob3ran0/' }),
        title: 'O Antigo Soberano da Eternidade',
        timeout: 30000
    },
    child: {
        id: '/manga/sob3ran0/cap-01/',
        title: 'CAP. 01',
        timeout: 25000
    },
    entry: {
        index: 1,
        size: 2_246_282,
        type: 'image/jpeg',
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());