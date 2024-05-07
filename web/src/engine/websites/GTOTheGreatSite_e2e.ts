import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gtotgs',
        title: 'GTO The Great Site'
    },
    container: {
        url: 'https://reader.gtothegreatsite.net/comics/il-mio-senpai-e-irritante',
        id: 'il-mio-senpai-e-irritante',
        title: 'Il mio senpai è irritante'
    },
    child: {
        id: '/read/il-mio-senpai-e-irritante/it/vol/9/ch/177',
        title: 'Vol.9 Ch.177'
    },
    entry: {
        index: 0,
        size: 706_981,
        type: 'image/png'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());