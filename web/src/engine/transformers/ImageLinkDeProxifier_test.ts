import { describe, it, expect } from 'vitest';
import testee from './ImageLinkDeProxifier';

describe('ImageProxyTransformer', () => {

    describe('Transform()', () => {

        it('Should not transform without proxy', () => {
            const uri = new URL('https://cdn.image.host/picture.png?token=123&expire=987');
            expect(testee(uri)).toBe(uri);
        });

        it('Should keep data URL', () => {
            const url = 'data:image/png;base64,XXXXXXXX';
            const uri = new URL(url);
            expect(testee(uri).href).toBe(url);
        });

        it('Should transform photon proxy', () => {
            const uri = new URL('https://i0.wp.com/cdn.image.host/picture.png');
            expect(testee(uri).href).toBe('http://cdn.image.host/picture.png');
            uri.searchParams.set('ssl', '1');
            expect(testee(uri).href).toBe('https://cdn.image.host/picture.png');
            uri.searchParams.set('q', 'token=123&expire=987');
            expect(testee(uri).href).toBe('https://cdn.image.host/picture.png?token=123&expire=987');
        });

        it('Should transform google proxy', () => {
            const uri = new URL('https://images123-focus-opensocial.googleusercontent.com/gadgets/proxy');
            uri.search = 'container=focus&gadget=a&no_expand=1&rewriteMime=image/*';
            uri.searchParams.set('url', 'https://cdn.image.host/picture.png?token=123&expire=987');
            expect(testee(uri).href).toBe('https://cdn.image.host/picture.png?token=123&expire=987');
        });

        it('Should throw for missing url parameter in google proxy', () => {
            const uri = new URL('https://images123-focus-opensocial.googleusercontent.com/gadgets/proxy');
            uri.search = 'container=focus&gadget=a&no_expand=1&rewriteMime=image/*';
            expect(() => testee(uri)).toThrowError(/Invalid URL/i);
        });

        it('Should transform wordpress passthru proxy', () => {
            const uri = new URL('http://cdn.image.host/wp-content/webpc-passthru.php');
            uri.searchParams.set('src', 'https://cdn.image.host/picture.png&nocache=1?ssl=1');
            expect(testee(uri).href).toBe('https://cdn.image.host/picture.png&nocache=1?ssl=1');
        });

        it('Should throw for missing src parameter in wordpress passthru proxy', () => {
            const uri = new URL('http://cdn.image.host/wp-content/webpc-passthru.php');
            expect(() => testee(uri)).toThrowError(/Invalid URL/i);
        });

        it.each([
            'https://cdn.statically.io/img/cdn.image.host/picture.png',
            'https://cdn.statically.io/img/cdn.image.host/w=123/picture.png',
            'https://cdn.statically.io/img/cdn.image.host/h=123/picture.png',
            'https://cdn.statically.io/img/cdn.image.host/q=123/picture.png',
            'https://cdn.statically.io/img/cdn.image.host/f=auto/picture.png',
            'https://cdn.statically.io/img/cdn.image.host/w=1200,h=2600/picture.png',
            'https://cdn.statically.io/img/cdn.image.host/w=1200,h=2600,q=80,f=auto/picture.png',
            'https://cdn.statically.io/img/bacakomik/cdn.image.host/picture.png',
        ])('Should transform statically proxy', url => {
            const uri = new URL(url);
            expect(testee(uri).href).toBe('https://cdn.image.host/picture.png');
        });
    });
});
