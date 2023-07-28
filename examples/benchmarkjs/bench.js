const Benchmark = require("benchmark");
const msal = require("@azure/msal-node");
// const fs = require("fs");
// const CACHE_LOCATION = "./cache.json";

const clientConfig = {
    auth: {
        clientId: "client_id",
        authority: "https://login.microsoftonline.com/tenant_id",
        knownAuthorities: ["https://login.microsoftonline.com/tenant_id"],
        clientSecret: "client_secret",
    },
    /**cache: {
        cachePlugin: new class CustomCachePlugin {
            beforeCacheAccess(cacheContext) {
                return new Promise((resolve, reject) => {
                    if (fs.existsSync(CACHE_LOCATION)) {
                        fs.readFile(CACHE_LOCATION, "utf-8", (err, data) => {
                            if (err) {
                                reject(err);
                            } else {
                                cacheContext.tokenCache.deserialize(data);
                                resolve();
                            }
                        });
                    } else {
                       fs.writeFile(CACHE_LOCATION, cacheContext.tokenCache.serialize(), (err) => {
                            if (err) {
                                reject(err);
                            }
                        });
                    }
                });
            }
            afterCacheAccess(cacheContext) {
                return new Promise((resolve, reject) => {
                    if(cacheContext.cacheHasChanged){
                        fs.writeFile(CACHE_LOCATION, cacheContext.tokenCache.serialize(), (err) => {
                            if (err) {
                                reject(err);
                            }
                            resolve();
                        });
                    } else {
                        resolve();
                    }
                });
            }
        }
    },*/
    system: {
        networkClient: new class CustomHttpClient {
            sendGetRequestAsync(url, options, cancellationToken) {
                return new Promise((resolve, reject) => {
                    const networkResponse = NetworkUtils.getNetworkResponse(
                        DEFAULT_OPENID_CONFIG_RESPONSE.headers,
                        DEFAULT_OPENID_CONFIG_RESPONSE.body,
                        DEFAULT_OPENID_CONFIG_RESPONSE.status,
                    );
                    resolve(networkResponse);
                });
            }
            sendPostRequestAsync(url, options) {
                return new Promise((resolve, _reject) => {
                    const networkResponse = NetworkUtils.getNetworkResponse(
                        CONFIDENTIAL_CLIENT_AUTHENTICATION_RESULT.headers,
                        CONFIDENTIAL_CLIENT_AUTHENTICATION_RESULT.body,
                        CONFIDENTIAL_CLIENT_AUTHENTICATION_RESULT.status,
                    );
                    resolve(networkResponse);
                });
            }
        }
    },
};

const NUM_CACHE_ITEMS = 10;

const confidentialClientApplication = new msal.ConfidentialClientApplication(clientConfig);
const firstResourceRequest = {
    scopes: ["resource-1/.default"],
};
const lastResourceRequest = {
    scopes: [`resource-${NUM_CACHE_ITEMS}/.default`],
};

(async () => {
    for (let i = 1; i <= NUM_CACHE_ITEMS; i++) {
        const request = {
            scopes: [`resource-${i}/.default`],
        };
        await confidentialClientApplication.acquireTokenByClientCredential(request);
    }

    const suite = new Benchmark.Suite();
    suite
        .add("ConfidentialClientApplication#acquireTokenByClientCredential-fromCache-resourceIsFirstItemInTheCache", async () => {
            await sleep(1000);
            await confidentialClientApplication.acquireTokenByClientCredential(firstResourceRequest);
        })
        .add("ConfidentialClientApplication#acquireTokenByClientCredential-fromCache-resourceIsLastItemInTheCache", async () => {
            await sleep(1000);
            await confidentialClientApplication.acquireTokenByClientCredential(lastResourceRequest);
        })
        // add listeners
        .on("cycle", (event) => {
            console.log(String(event.target));
        })
        // .on("complete", () => {
        //     // console.log("Fastest is " + this.filter("fastest").map("name"));
        //     // console.log("complete");
        // })
        // run async
        .run({ "async": true });
})();

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class NetworkUtils {
    static getNetworkResponse(headers, body, statusCode) {
        return {
            headers: headers,
            body: body,
            status: statusCode,
        };
    }
}

const DEFAULT_OPENID_CONFIG_RESPONSE = {
    headers: {},
    status: 200,
    body: {
        token_endpoint:
            "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token",
        token_endpoint_auth_methods_supported: [
            "client_secret_post",
            "private_key_jwt",
            "client_secret_basic",
        ],
        jwks_uri:
            "https://login.microsoftonline.com/{tenant}/discovery/v2.0/keys",
        response_modes_supported: ["query", "fragment", "form_post"],
        subject_types_supported: ["pairwise"],
        id_token_signing_alg_values_supported: ["RS256"],
        response_types_supported: [
            "code",
            "id_token",
            "code id_token",
            "id_token token",
        ],
        scopes_supported: ["openid", "profile", "email", "offline_access"],
        issuer: "https://login.microsoftonline.com/{tenant}/v2.0",
        request_uri_parameter_supported: false,
        userinfo_endpoint: "https://graph.microsoft.com/oidc/userinfo",
        authorization_endpoint:
            "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize",
        http_logout_supported: true,
        frontchannel_logout_supported: true,
        end_session_endpoint:
            "https://login.microsoftonline.com/{tenant}/oauth2/v2.0/logout",
        claims_supported: [
            "sub",
            "iss",
            "cloud_instance_name",
            "cloud_instance_host_name",
            "cloud_graph_host_name",
            "msgraph_host",
            "aud",
            "exp",
            "iat",
            "auth_time",
            "acr",
            "nonce",
            "preferred_username",
            "name",
            "tid",
            "ver",
            "at_hash",
            "c_hash",
            "email",
        ],
        tenant_region_scope: null,
        cloud_instance_name: "microsoftonline.com",
        cloud_graph_host_name: "graph.windows.net",
        msgraph_host: "graph.microsoft.com",
        rbac_url: "https://pas.windows.net",
    },
};

const CONFIDENTIAL_CLIENT_AUTHENTICATION_RESULT = {
    headers: {},
    status: 200,
    body: {
        token_type: "Bearer",
        expires_in: 3599,
        ext_expires_in: 3599,
        refresh_in: 3598 / 2,
        access_token: "thisIs.an.accessT0ken",
    },
};