import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'yaoichan',
        title: 'Яой-тян (Yaoi-chan)'
    },
    container: {
        url: 'https://v1.yaoi-chan.me/manga/111510-oyasumi-shinkai.html',
        id: '/manga/111510-oyasumi-shinkai.html',
        title: 'Oyasumi Shinkai (Спокойной ночи, глубокое море.)'
    },
    child: {
        id: '/online/1008241-oyasumi-shinkai_v1_ch4.html',
        title: 'Oyasumi Shinkai   v1 - 4.1   Чудесной новогодней ночи!'
    },
    entry: {
        index: 0,
        size: 699_054,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());