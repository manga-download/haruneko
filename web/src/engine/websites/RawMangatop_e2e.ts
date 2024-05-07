import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rawmangatop',
        title: 'Raw Manga (生漫画)'
    },
    /* CloudFlare
    container: {
        url: 'https://rawmanga.top/Bouken-ka-ni-Narou-Skill-Board-de-Dungeon-Kouryaku',
        id: '/Bouken-ka-ni-Narou-Skill-Board-de-Dungeon-Kouryaku',
        title: 'Bouken-ka ni Narou!: Skill Board de Dungeon Kouryaku'
    },
    child: {
        id: '/Bouken-ka-ni-Narou-Skill-Board-de-Dungeon-Kouryaku/46.2',
        title: 'Chapter 46.2'
    },
    entry: {
        index: 0,
        size: 443_092,
        type: 'image/jpeg'
    }*/
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());