import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'comicborder',
        title: 'コミックボーダー (ComicBorder)'
    },
    container: {
        url: 'https://comicborder.com/episode/14079602755169791873',
        id: '/episode/14079602755169791873',
        title: '終末の魔女と人形'
    },
    child: {
        id: '/episode/14079602755169791873',
        title: 'Ep.01'
    },
    entry: {
        index: 0,
        size: 1_197_347,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, () => fixture.AssertWebsite());