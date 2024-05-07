import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'luscious',
        title: 'Luscious'
    },
    container: {
        url: 'https://www.luscious.net/albums/nomikai-de-ikemen-no-senpai-no_500170/',
        id: '500170',
        title: 'Nomikai de Ikemen no Senpai no Omochikaeri Sarechau Ko'
    },
    child: {
        id: '500170',
        title: 'Nomikai de Ikemen no Senpai no Omochikaeri Sarechau Ko'
    },
    entry: {
        index: 0,
        size: 789_681,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());