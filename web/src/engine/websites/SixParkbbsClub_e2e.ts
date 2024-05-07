import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sixparkbbsclub',
        title: '6parkbbs Club (新❀华漫)'
    },
    container: {
        url: 'https://club.6parkbbs.com/enter6/index.php?app=forum&act=threadview&tid=13926326',
        id: '/enter6/index.php?app=forum&act=threadview&tid=13926326',
        title: '异世界得到开挂能力 第5话 人生的变化'
    },
    child: {
        id: '/enter6/index.php?app=forum&act=threadview&tid=13926326',
        title: '异世界得到开挂能力 第5话 人生的变化'
    },
    entry: {
        index: 0,
        size: 244_837,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());