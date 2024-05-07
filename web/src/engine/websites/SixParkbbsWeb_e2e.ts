import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sixparkbbsweb',
        title: '6parkbbs Web (新❀华漫)'
    },
    container: {
        url: 'https://web.6parkbbs.com/index.php?app=forum&act=view&tid=3746177',
        id: '/index.php?app=forum&act=view&tid=3746177',
        title: '身为鬼畜up的我被影帝看上了（预告+第一卷·上：总·1-5话）'
    },
    child: {
        id: '/index.php?app=forum&act=view&tid=3746177',
        title: '身为鬼畜up的我被影帝看上了（预告+第一卷·上：总·1-5话）'
    },
    entry: {
        index: 0,
        size: 151_815,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());