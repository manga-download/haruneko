import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'herosweb',
        title: `Hero's (ヒーローズ)`
    },
    container: {
        url: 'https://viewer.heros-web.com/episode/4856001361588074579',
        id: '/episode/4856001361588074579',
        title: '虫葬りの巫女'
    },
    child: {
        id: '/episode/4856001361514461568',
        title: '第二十三話  番人の矜持'
    },
    entry: {
        index: 0,
        size: 1_724_658,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());