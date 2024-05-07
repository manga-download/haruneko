import { describe } from 'vitest';
import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
    plugin: {
        id: 'pelateam',
        title: 'Pela Team'
    },
    container: {
        url: 'https://pelateam.org/Computer/?manga=One-Punch+Man+-+Murata&volume=%7ECAPITOLI+NON+ANCORA+IN+FORMATO+TANKOBON%7E',
        id: '/Computer/?manga=One-Punch+Man+-+Murata&volume=%7ECAPITOLI+NON+ANCORA+IN+FORMATO+TANKOBON%7E',
        title: 'One-Punch Man - Murata'
    },
    child: {
        id: '/Computer/?manga=One-Punch+Man+-+Murata&volume=%7ECAPITOLI+NON+ANCORA+IN+FORMATO+TANKOBON%7E&chapter=Pugno+198+%7E+%28238%29+%7E+Realt%C3%A0+a+me+sconosciute',
        title: 'Pugno 198 ~ (238) ~ Realtà a me sconosciute'
    },
    entry: {
        index: 0,
        size: 384_175,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());