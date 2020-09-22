import { ImageLinkDeProxifier } from './ImageLinkDeProxifier';

describe('ImageProxyTransformer', () => {

    describe('Transform()', () => {

        it('Should not transform without proxy', () => {
            const testee = new ImageLinkDeProxifier();
            const url = 'https://cdn.image.host/picture.png?token=123&expire=987';
            expect(testee.Convert(url)).toBe(url);
        });

        it('Should transform photon proxy', () => {
            const testee = new ImageLinkDeProxifier();
            const uri = new URL('https://i0.wp.com/cdn.image.host/picture.png');
            expect(testee.Convert(uri.href)).toBe('http://cdn.image.host/picture.png');
            uri.searchParams.set('ssl', '1');
            expect(testee.Convert(uri.href)).toBe('https://cdn.image.host/picture.png');
            uri.searchParams.set('q', 'token=123&expire=987');
            expect(testee.Convert(uri.href)).toBe('https://cdn.image.host/picture.png?token=123&expire=987');
        });

        it('Should transform google proxy', () => {
            const testee = new ImageLinkDeProxifier();
            const uri = new URL('https://images123-focus-opensocial.googleusercontent.com/gadgets/proxy');
            uri.search = 'container=focus&gadget=a&no_expand=1&rewriteMime=image/*';
            uri.searchParams.set('url', 'https://cdn.image.host/picture.png?token=123&expire=987');
            expect(testee.Convert(uri.href)).toBe('https://cdn.image.host/picture.png?token=123&expire=987');
        });

        it('Should throw for missing url parameter in google proxy', () => {
            const testee = new ImageLinkDeProxifier();
            const uri = new URL('https://images123-focus-opensocial.googleusercontent.com/gadgets/proxy');
            uri.search = 'container=focus&gadget=a&no_expand=1&rewriteMime=image/*';
            expect(() => testee.Convert(uri.href)).toThrowError(/<url>/i);
        });
    });
});