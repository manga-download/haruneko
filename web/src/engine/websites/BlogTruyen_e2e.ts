import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'blogtruyen',
        title: 'BlogTruyen'
    },
    container: {
        url: 'https://blogtruyen.vn/15325/arcadia-of-the-moonlight',
        id: '/15325/arcadia-of-the-moonlight',
        title: 'Arcadia Of The Moonlight'
    },
    child: {
        id: '/c247578/arcadia-of-the-moonlight-chap-1',
        title: 'chap 1'
    },
    entry: {
        index: 6,
        size: 267_787,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());
