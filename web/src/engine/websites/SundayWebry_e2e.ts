import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'sundaywebry',
        title: 'サンデーうぇぶり (Sunday Webry)'
    },
    container: {
        url: 'https://www.sunday-webry.com/episode/14079602755274980354',
        id: '/episode/14079602755274980354',
        title: 'からかい上手の高木さん'
    },
    child: {
        id: '/episode/3269754496654358124',
        title: '1. 消しゴム'
    },
    entry: {
        index: 0,
        size: 464_508,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());