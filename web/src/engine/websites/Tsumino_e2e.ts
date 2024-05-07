import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'tsumino',
        title: 'Tsumino'
    },
    container: {
        url: 'https://www.tsumino.com/entry/52223',
        id: '/entry/52223',
        title: `Fujimaru Ritsuka wa SuperDarli Shachou Nanka ni Makenai!! | Fujimaru Ritsuka won't Lose to some Super-Darling Manager!! / 藤丸立香はスパダリ社長なんかに負けない!!`
    },
    child: {
        id: '/entry/52223',
        title: `Fujimaru Ritsuka wa SuperDarli Shachou Nanka ni Makenai!! | Fujimaru Ritsuka won't Lose to some Super-Darling Manager!! / 藤丸立香はスパダリ社長なんかに負けない!!`
    },
    entry: {
        index: 0,
        size: 507_338,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());