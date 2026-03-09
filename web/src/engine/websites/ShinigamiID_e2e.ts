import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'shinigamiid',
        title: 'Shinigami ID',
    },
    container: {
        url: 'https://09.shinigami.asia/series/73a836fe-373e-4645-a5d9-a517922be4d3',
        id: '73a836fe-373e-4645-a5d9-a517922be4d3',
        title: 'SSS-Class Suicide Hunter'
    },
    child: {
        id: 'd676ac4e-8f4a-4699-9e53-ea2de268c990',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 644_205,
        type: 'image/jpeg'
    }
}).AssertWebsite();