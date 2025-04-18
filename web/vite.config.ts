import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const buildID = Date.now().toString(36).toUpperCase();

/**
 * A key for the {@link sslCert}
 */
const sslKey = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC4L/K8cjYxOONA
Achqw/0SFaQyHg4ESBBe4HCbaNB5L7A40P7BjmMo5+WXwGHlj3dpfXP3SX0x7pWg
1nctHy7r0O2A8PSLxPpgzvNgO5U4pXqi0arlpGbcbRLKI00MLhXzj6NUdxX+r1re
Pa9brcKyyvXhQ2I4kBDwvC1jZtWO4H171WmjQZya3PW72sNwqa0jSn44QHDUHMlA
rZGQpQ3rbIWxIf8GiPRnW+uHzJz1cV0s+E+S+GoTyykzue7aami0cN2lSIjQf/P9
RCds8KioI6elUuOWyBov/NuZVA5F1m90e8rkpFk78riYpgD8kG79OSeo7McmLq2j
pJ6+NClPAgMBAAECggEAH+u/Z8VrevBfAhLNByPcUiwJ/t2SlE9g9vBy05xAtR/8
rHwcCrOAn/BArCIdVUmd6lxhorPLzMGKkQtaMCm9WgUlhDk+SJLkya5UI5Nv8xdK
v7kSoyXw5bbJkNq5WakLCOEV72eMGk2NtAKAx6S/n3jpUBb7iM3/AZm7TATgchhO
mpdQY43IZ32OPI7++S/j+i2CWi9ZdZppiRN7kaS6feFeoLWu2Z9Wa0+2e9klum+z
3hbvbj25T1T+lv10civLzRw1tZm4Puuh7MfDdTyMixn3TX2HK/uZnKRotu0700H9
SGEJ6P8hosjwFjb5qn57cAzRdpgwIuJKFef1QhqnQQKBgQDflnFKrzaZDPAysXkx
4cBCq/ZnCQHl8M6sgPdl0g3TlgXYkMkG9w6aXRgtVrmCtwjAZ2U3VigHOubuo+8f
A7jEiefGrCGg65dsHQzh+1yFIGZXqx7dNWv5GPvpYJSEdoEZrxHbL7AspDBaFne2
2QvUYcMyRUKhWkC/RfTFyT61HwKBgQDS41HAfpwqyfhaaT5IZFadUB8zoslv3VAG
ZstMT45YKWhgt3z/G7wqSZjD7THmjFyo5wy6FmGX+IeYMJXymj0GMO+29etQ0nlZ
Nd8uyrLMCoAWPoX2Y3YO9oBxOO3/ReTDH3kfCdAY5Txr9gIdkXX0e0ThEnyDCiDB
9ZmY/UFV0QKBgQDINvGQTUH436sf2eiLEHqXuWFWdqxqea64rmvbk7Op6selXFGH
mShMdly2DNjmAn0lvfDXEqGZh9dPjyELhsunw033jCA4936K46Cro+j/lTnP+34R
3EqprwO1wjR8QZnto+W7fwKllwltQn1FESsUrc6bb4Xw8t7T6RL9Ie6zRQKBgHB7
p0NRROLdz4YJ1JqwSjKmZb4Y+fCczu5bLdyKIpaLn4zW0ekQVhEIKF94yMD75QCC
HJu1DGEOwuQ+Jfy8oAgJWhLwoI7/dJJM1boTi8KhZyh2OOXury3T9TZu8yLRmO8q
fmQ7y687tjqvgPlceNnqVhbm0VrjsA1EfqTHkG3BAoGAV3ytVbINwVhmvNber6f3
Ud/qqW3y6xpQ8wAc0hQwu1tQqQyUBQr0fudaem6WNvQVkbDjBTil/h/fiW/c0ex9
uoPMi8x/ULXo3kyrW8oLvBPbmK2Dmkoneez7j+Mj0NwiDV73LgGq/bIrexAqj9uo
EcUoTUPkVjUCL2jKN+bKG78=
-----END PRIVATE KEY-----`;

/**
 * A self-signed certificate for localhost
 */
const sslCert = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIUZQZMfKIp28NP8facAMaSw+jSVcwwDQYJKoZIhvcNAQEL
BQAwJzESMBAGA1UEAwwJbG9jYWxob3N0MREwDwYDVQQKDAhIYWt1TmVrbzAgFw0y
NTA0MTcxNjQ2NDJaGA8yMTI1MDMyNDE2NDY0MlowJzESMBAGA1UEAwwJbG9jYWxo
b3N0MREwDwYDVQQKDAhIYWt1TmVrbzCCASIwDQYJKoZIhvcNAQEBBQADggEPADCC
AQoCggEBALgv8rxyNjE440AByGrD/RIVpDIeDgRIEF7gcJto0HkvsDjQ/sGOYyjn
5ZfAYeWPd2l9c/dJfTHulaDWdy0fLuvQ7YDw9IvE+mDO82A7lTileqLRquWkZtxt
EsojTQwuFfOPo1R3Ff6vWt49r1utwrLK9eFDYjiQEPC8LWNm1Y7gfXvVaaNBnJrc
9bvaw3CprSNKfjhAcNQcyUCtkZClDetshbEh/waI9Gdb64fMnPVxXSz4T5L4ahPL
KTO57tpqaLRw3aVIiNB/8/1EJ2zwqKgjp6VS45bIGi/825lUDkXWb3R7yuSkWTvy
uJimAPyQbv05J6jsxyYuraOknr40KU8CAwEAAaN/MH0wHQYDVR0OBBYEFJPhNsLV
qhp4dQrXeyiHUV6BKF89MB8GA1UdIwQYMBaAFJPhNsLVqhp4dQrXeyiHUV6BKF89
MA4GA1UdDwEB/wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIw
DAYDVR0TAQH/BAIwADANBgkqhkiG9w0BAQsFAAOCAQEAHGM3T/7YH4ri5PRMtgt3
2LLOzDXl0FN3mx/QeNm8BGV4jHd5Bl4ZFEvI2rjV8mbeq3OLOn8u/U3So59P1Jc3
MHIU0yNoCptj861c7KT5JfRWtZ5Zu+njEClA6t+jlRaMLCCVU+N1Xk38MsSTESHT
nYIxiMLhM7bgRqEqTOyP7+MLcY3jgFX1AwsnY2S8GJ9/i9fH5M5kszZt5WIrIMvE
D5FwNfPAIxKKj5Aps1NzdPq5uS6dYcfCIpInDu5kOc01jHtRHDiadKj3cFk0u15O
iWxS8F+IcaleGLf8SvNwqz+SikcANDbtOUagrPiA1YG/BraQBLMA7kbkmLel9sjT
iw==
-----END CERTIFICATE-----`;

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        react(),
        svelte({
            onwarn: function(warning, handler) {
                return warning.code.startsWith('a11y-') ? undefined : handler?.call(this, warning);
            }
        }),
    ],
    publicDir: 'static',
    build: {
        minify: 'esbuild',
        sourcemap: false,
        outDir: 'build',
        chunkSizeWarningLimit: 2 * 1024,
        rollupOptions: {
            input: {
                index: './index.html',
                sw: './src/service-worker.ts',
            },
            output: {
                entryFileNames: file => (file.name !== 'sw' ? `${buildID}/` : '') + '[name].js',
                assetFileNames: `${buildID}/[name].[ext]`,
                chunkFileNames: `${buildID}/[name].js`,
                manualChunks: function(id) {
                    if(id.includes('node_modules')) {
                        return 'Vendor';
                    }
                    if(/\/web\/src\/engine\/websites\//.test(id) && /\/[a-zA-Z0-9_-]+\.webp$/.test(id)) {
                        return 'WebsiteIcons';
                    }
                },
            },
        },
    },
    worker: {
        rollupOptions: {
            output: {
                entryFileNames: `${buildID}/[name].js`,
                assetFileNames: `${buildID}/[name].[ext]`,
                chunkFileNames: `${buildID}/[name].js`,
            }
        }
    },
    esbuild: {
        minifySyntax: true,
        minifyWhitespace: true,
        minifyIdentifiers: false,
        keepNames: true,
    },
    optimizeDeps: {
        // TODO: once carbon-componenets-svelte v1 is released, check if svelte optimize has been improved
        // carbon-components-svelte is large, prebundle
        include: ['carbon-components-svelte'],
    },
    server: {
        headers: {
            'Service-Worker-Allowed': '/'
        },
        https:{
            key: sslKey,
            cert: sslCert,
        }
    }
});