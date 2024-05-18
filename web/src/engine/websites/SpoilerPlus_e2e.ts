import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'spoilerplus',
        title: 'SpoilerPlus'
    },
    container: {
        url: 'https://spoilerplus.tv/%e3%82%ad%e3%83%b3%e3%82%b0%e3%83%80%e3%83%a0-raw-free/',
        id: '/%e3%82%ad%e3%83%b3%e3%82%b0%e3%83%80%e3%83%a0-raw-free/',
        title: 'キングダム'
    },
    child: {
        id: '/%e3%82%ad%e3%83%b3%e3%82%b0%e3%83%80%e3%83%a0-raw-free/%E7%AC%AC796%E8%A9%B1/',
        title: '第796話'
    },
    entry: {
        index: 0,
        size: 1_031_941,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());