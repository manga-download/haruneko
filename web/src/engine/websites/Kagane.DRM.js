/* eslint-disable -- @preserved */
import protobuf from 'protobufjs';
import protoTypes from './Kagane.proto?raw';
import { FetchJSON } from "../platform/FetchProvider";
import { GetBase64FromBytes } from "../BufferEncoder";
import { RandomBytes } from "../Random";


// Hardcoded Widevine SystemID for the PSSH box: edef8ba979d64acea3c827dcd51d21ed
// Available in https://kagane.org/_next/static/chunks/common-e6bef285f8b57c56.js
const WIDEVINE_SYSTEM_ID = Uint8Array.from(
    [
        237, 239, 139, 169, 
        121, 214, 74, 206, 
        163, 200, 39, 220, 
        213, 29, 33, 237,
    ]
);


export class DRMProvider {
    #protoSignedMessage;
    #protoLicenseRequest;

    constructor() {
        const root = protobuf.parse(protoTypes, { keepCase: true }).root;
        this.#protoSignedMessage = root.lookupType("SignedMessage");
        this.#protoLicenseRequest = root.lookupType("LicenseRequest");
    }

    async #DeriveKeyId(assetId) {
        const data = new TextEncoder().encode(`:${assetId}`);
        const hash = await crypto.subtle.digest("SHA-256", data);
        return new Uint8Array(hash).slice(0, 16);
    }

    async #BuildWidevinePSSH(assetId) {
        const kid = await this.#DeriveKeyId(assetId);

        const kidField = new Uint8Array(2 + kid.length);
        kidField[0] = 0x12;
        kidField[1] = kid.length;
        kidField.set(kid, 2);

        const versionFlags = new Uint8Array(4);
        const dataLenView = new DataView(new ArrayBuffer(4));
        dataLenView.setUint32(0, kidField.length, false);
        const dataLen = new Uint8Array(dataLenView.buffer);

        const payload = new Uint8Array([
            ...versionFlags,
            ...WIDEVINE_SYSTEM_ID,
            ...dataLen,
            ...kidField,
        ]);

        const boxLenView = new DataView(new ArrayBuffer(4));
        boxLenView.setUint32(0, payload.length + 8, false);
        const boxLen = new Uint8Array(boxLenView.buffer);

        return new Uint8Array([
            ...boxLen,
            ...new TextEncoder().encode("pssh"),
            ...payload,
        ]).buffer;
    }

    async #CreateMediaLicenseChallenge(psshBuffer) {
        const psshBytes = new Uint8Array(psshBuffer).slice(32);

        const licenseRequest = this.#protoLicenseRequest.create({
            type: 1,
            protocol_version: 22,
            request_time: Date.now() / 1000 >>> 0,
            key_control_nonce: Math.random() * 0xFFFFFFFF >>> 0,
            encrypted_client_id: {
                service_id: "staging.google.com",
                service_certificate_serial_number: RandomBytes(16),
                encrypted_client_id: RandomBytes(4480),
                encrypted_client_id_iv: RandomBytes(16),
                encrypted_privacy_key: RandomBytes(256),
            },
            content_id: {
                cenc_id: {
                    pssh: [psshBytes],
                    license_type: 1,
                    request_id: RandomBytes(16),
                },
            },
        });

        const signedMessage = this.#protoSignedMessage.create({
            type: 1,
            msg: this.#protoLicenseRequest.encode(licenseRequest).finish(),
            signature: RandomBytes(128),
        });

        return this.#protoSignedMessage.encode(signedMessage).finish();
    }

    async #CreateIntegrityChallenge() {
        const { token, exp } = await FetchJSON(
            new Request(`https://kagane.org/api/integrity`, {
                method: "POST",
            })
        );
        return { token, exp };
    }

    async CreateImageURL(tokenEndpointUrl, bookId, assetId, isDataSaver = false) {
        const { token } = await this.#CreateIntegrityChallenge();
        const psshBuffer = await this.#BuildWidevinePSSH(assetId);
        const challenge = await this.#CreateMediaLicenseChallenge(psshBuffer);

        const { cache_url, access_token, pages } = await FetchJSON(
            new Request(tokenEndpointUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Integrity-Token": token,
                },
                body: JSON.stringify({ challenge: GetBase64FromBytes(challenge) }),
            })
        );

        const baseUrl = cache_url.endsWith("/") ? cache_url.slice(0, -1) : cache_url;

        return pages.map((pageEntry, index) => {
            const parameters = {
                MangaID: bookId,
                ChapterID: assetId,
                PageNumber: pageEntry.page_number ?? index + 1,
            };

            const link = new URL(
                `${baseUrl}/api/v2/books/file/${assetId}/${pageEntry.page_uuid}`
            );
            link.searchParams.set("token", access_token);
            link.searchParams.set("is_datasaver", String(isDataSaver));

            return { link, parameters };
        });
    }

    async DecryptImage(encryptedData, _mimeType = "image/webp") {
        return new Blob([encryptedData], { type: _mimeType });
    }
}