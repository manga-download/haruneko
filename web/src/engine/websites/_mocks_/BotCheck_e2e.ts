import { TestFixture } from '../../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'bot-check',
        title: '🔷 Bot-Check 🔷'
    },
    container: {
        url: 'https://cloudflare.bot-check.ovh/automatic',
        id: 'https://cloudflare.bot-check.ovh/automatic',
        title: 'Cloudflare: JavaScript Challenge',
        timeout: 120_000,
    },
    child: {
        id: 'https://cloudflare.bot-check.ovh/automatic',
        title: '✅ SUCCESS',
        timeout: 120_000,
    }
}).AssertWebsite();