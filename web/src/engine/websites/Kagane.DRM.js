/* eslint-disable -- @preserved */
import L from "protobufjs";
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
        const root = L.parse(`

syntax = "proto2";
package video_widevine_server.sdk;
option optimize_for = LITE_RUNTIME;

enum LicenseType {
  STREAMING = 1;
  OFFLINE = 2;
}

message LicenseIdentification {
  optional bytes request_id = 1;
  optional bytes session_id = 2;
  optional bytes purchase_id = 3;
  optional LicenseType type = 4;
  optional int32 version = 5;
  optional bytes provider_session_token = 6;
}

message License {
  message Policy {
    optional bool can_play = 1 [default = false];
    optional bool can_persist = 2 [default = false];
    optional bool can_renew = 3 [default = false];
    optional int64 rental_duration_seconds = 4 [default = 0];
    optional int64 playback_duration_seconds = 5 [default = 0];
    optional int64 license_duration_seconds = 6 [default = 0];
    optional int64 renewal_recovery_duration_seconds = 7 [default = 0];
    optional string renewal_server_url = 8;
    optional int64 renewal_delay_seconds = 9 [default = 0];
    optional int64 renewal_retry_interval_seconds = 10 [default = 0];
    optional bool renew_with_usage = 11 [default = false];
    optional bool renew_with_client_id = 12 [default = false];
  }

  message KeyContainer {
    enum KeyType {
      SIGNING = 1;
      CONTENT = 2;
      KEY_CONTROL = 3;
      OPERATOR_SESSION = 4;
    }
    enum SecurityLevel {
      SW_SECURE_CRYPTO = 1;
      SW_SECURE_DECODE = 2;
      HW_SECURE_CRYPTO = 3;
      HW_SECURE_DECODE = 4;
      HW_SECURE_ALL = 5;
    }
    message KeyControl {
      optional bytes key_control_block = 1;
      optional bytes iv = 2;
    }
    message OutputProtection {
      enum HDCP {
        HDCP_NONE = 0;
        HDCP_V1 = 1;
        HDCP_V2 = 2;
        HDCP_V2_1 = 3;
        HDCP_V2_2 = 4;
        HDCP_NO_DIGITAL_OUTPUT = 0xff;
      }
      optional HDCP hdcp = 1 [default = HDCP_NONE];
      enum CGMS {
        CGMS_NONE = 42;
        COPY_FREE = 0;
        COPY_ONCE = 2;
        COPY_NEVER = 3;
      }
      optional CGMS cgms_flags = 2 [default = CGMS_NONE];
    }
    message VideoResolutionConstraint {
      optional uint32 min_resolution_pixels = 1;
      optional uint32 max_resolution_pixels = 2;
      optional OutputProtection required_protection = 3;
    }
    message OperatorSessionKeyPermissions {
      optional bool allow_encrypt = 1 [default = false];
      optional bool allow_decrypt = 2 [default = false];
      optional bool allow_sign = 3 [default = false];
      optional bool allow_signature_verify = 4 [default = false];
    }
    optional bytes id = 1;
    optional bytes iv = 2;
    optional bytes key = 3;
    optional KeyType type = 4;
    optional SecurityLevel level = 5 [default = SW_SECURE_CRYPTO];
    optional OutputProtection required_protection = 6;
    optional OutputProtection requested_protection = 7;
    optional KeyControl key_control = 8;
    optional OperatorSessionKeyPermissions operator_session_key_permissions = 9;
    repeated VideoResolutionConstraint video_resolution_constraints = 10;
    optional bool anti_rollback_usage_table = 11 [default = false];
  }

  optional LicenseIdentification id = 1;
  optional Policy policy = 2;
  repeated KeyContainer key = 3;
  optional int64 license_start_time = 4;
  optional bool remote_attestation_verified = 5 [default = false];
  optional bytes provider_client_token = 6;
}

enum ProtocolVersion {
  VERSION_2_0 = 20;
  VERSION_2_1 = 21;
  VERSION_2_2 = 22;
}

message LicenseRequest {
  message ContentIdentification {
    message CENC {
      repeated bytes pssh = 1;
      optional LicenseType license_type = 2;
      optional bytes request_id = 3;
    }
    message WebM {
      optional bytes header = 1;
      optional LicenseType license_type = 2;
      optional bytes request_id = 3;
    }
    message ExistingLicense {
      optional LicenseIdentification license_id = 1;
      optional int64 seconds_since_started = 2;
      optional int64 seconds_since_last_played = 3;
      optional bytes session_usage_table_entry = 4;
    }
    optional CENC cenc_id = 1;
    optional WebM webm_id = 2;
    optional ExistingLicense license = 3;
  }
  enum RequestType {
    NEW = 1;
    RENEWAL = 2;
    RELEASE = 3;
  }
  optional ClientIdentification client_id = 1;
  optional ContentIdentification content_id = 2;
  optional RequestType type = 3;
  optional int64 request_time = 4;
  optional bytes key_control_nonce_deprecated = 5;
  optional ProtocolVersion protocol_version = 6 [default = VERSION_2_0];
  optional uint32 key_control_nonce = 7;
  optional EncryptedClientIdentification encrypted_client_id = 8;
}

message LicenseError {
  enum Error {
    INVALID_DEVICE_CERTIFICATE = 1;
    REVOKED_DEVICE_CERTIFICATE = 2;
    SERVICE_UNAVAILABLE = 3;
  }
  optional Error error_code = 1;
}

message RemoteAttestation {
  optional EncryptedClientIdentification certificate = 1;
  optional bytes salt = 2;
  optional bytes signature = 3;
}

message SignedMessage {
  enum MessageType {
    LICENSE_REQUEST = 1;
    LICENSE = 2;
    ERROR_RESPONSE = 3;
    SERVICE_CERTIFICATE_REQUEST = 4;
    SERVICE_CERTIFICATE = 5;
  }
  optional MessageType type = 1;
  optional bytes msg = 2;
  optional bytes signature = 3;
  optional bytes session_key = 4;
  optional RemoteAttestation remote_attestation = 5;
}

message ClientIdentification {
  enum TokenType {
    KEYBOX = 0;
    DEVICE_CERTIFICATE = 1;
    REMOTE_ATTESTATION_CERTIFICATE = 2;
  }
  message NameValue {
    optional string name = 1;
    optional string value = 2;
  }
  message ClientCapabilities {
    enum HdcpVersion {
      HDCP_NONE = 0;
      HDCP_V1 = 1;
      HDCP_V2 = 2;
      HDCP_V2_1 = 3;
      HDCP_V2_2 = 4;
      HDCP_NO_DIGITAL_OUTPUT = 0xff;
    }
    optional bool client_token = 1 [default = false];
    optional bool session_token = 2 [default = false];
    optional bool video_resolution_constraints = 3 [default = false];
    optional HdcpVersion max_hdcp_version = 4 [default = HDCP_NONE];
    optional uint32 oem_crypto_api_version = 5;
    optional bool anti_rollback_usage_table = 6 [default = false];
  }
  optional TokenType type = 1 [default = KEYBOX];
  optional bytes token = 2;
  repeated NameValue client_info = 3;
  optional bytes provider_client_token = 4;
  optional uint32 license_counter = 5;
  optional ClientCapabilities client_capabilities = 6;
}

message EncryptedClientIdentification {
  optional string service_id = 1;
  optional bytes service_certificate_serial_number = 2;
  optional bytes encrypted_client_id = 3;
  optional bytes encrypted_client_id_iv = 4;
  optional bytes encrypted_privacy_key = 5;
}`,
            { keepCase: true }
        ).root;

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