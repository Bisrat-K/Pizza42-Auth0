// The Auth0 client, initialized in configureClient()
var auth0SPA = null;
var config=null;
var user=null;
var webAuth = null;
var mgmt = null;
/**
 * Starts the authentication flow
 */
const login = async (targetUrl) => {
    try {
        console.log("Logging in", targetUrl);

        const options = {
            redirect_uri: window.location.origin,
            scope: 'openid profile email read:current_user update:current_user_identities update:current_user_metadata create:current_user_metadata delete:current_user_metadata create:current_user_device_credentials delete:current_user_device_credentials',
        };

        if (targetUrl) {
            options.appState = { targetUrl };
        }
        await auth0SPA.loginWithRedirect(options);
    } catch (err) {
        console.log("Log in failed", err);
    }
};

/**
 * Executes the logout flow
 */
const logout = () => {
    try {
        console.log("Logging out");
        auth0SPA.logout({
            returnTo: window.location.origin
        });
    } catch (err) {
        console.log("Log out failed", err);
    }
};

/**
 * Retrieves the auth configuration from the server
 */
const fetchAuthConfig = () => fetch("/auth_config.json");

/**
 * Initializes the Auth0 client
 */

const configureClient = async () => {
    const response = await fetchAuthConfig();
    config = await response.json();

    auth0SPA = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        audience: config.audience,
        scope: 'openid profile email read:current_user update:current_user_identities update:current_user_metadata create:current_user_metadata delete:current_user_metadata create:current_user_device_credentials delete:current_user_device_credentials',
    });
    try{
        user = await auth0SPA.getUser()
        if(user){
            configureMgmt()
        }
    }catch(e){
        console.log(e)
    }
};

/**
 * Checks to see if the user is authenticated. If so, `fn` is executed. Otherwise, the user
 * is prompted to log in
 * @param {*} fn The function to execute if the user is logged in
 */
const requireAuth = async (fn, targetUrl) => {
    const isAuthenticated = await auth0SPA.isAuthenticated();

    if (isAuthenticated) {
        return fn();
    }

    return login(targetUrl);
};

/**
 * Calls the API endpoint with an authorization token
 */
const callApi = async () => {
    try {
        const token = await auth0SPA.getTokenSilently();
        console.log(token);
        const response = await fetch("/api/external", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const responseData = await response.json();
        console.log(responseData);
    } catch (e) {
        console.error(e);
    }
};

const afterLogin = async () => {
    const query = window.location.search;
    const shouldParseResult = query.includes("code=") && query.includes("state=");
    if (shouldParseResult) {
        console.log("> Parsing redirect");
        try {
            const result = await auth0SPA.handleRedirectCallback();
            if (result.appState && result.appState.targetUrl) {
                showContentFromUrl(result.appState.targetUrl);
            }
            console.log("Logged in!");
        } catch (err) {
            console.log("Error parsing redirect:", err);
        }
        window.history.replaceState({}, document.title, "/");
    }
    try{
        user = await auth0SPA.getUser()
        if(user){
            await configureMgmt()
            render_orders()
        }
    }catch(e){
        console.log(e)
    }
}

const configureMgmt = async () => {
    webAuth = new auth0.WebAuth({
        domain: config.domain,
        clientID: config.clientId
    });
    mgmt = new auth0.Management({
        domain: config.domain,
        token: await auth0SPA.getTokenSilently()
    });
}

// a = await auth0SPA.getUser()
// mgmt.patchUserMetadata(user.sub,{'a':'b'},(err,res)=>console.log(err,res))
// mgmt.getUser(user.sub,(err,res)=>console.log(err,res))

const getUser = async (fn=(k,...a)=>console.log(k,a),...args) => {
    if(!mgmt)return null;
    await mgmt.getUser(user.sub,(err,res)=>{
        if(err)k = null;
        k = res;
        fn(k,...args);
    });
}

const patchUser = async (data,fn=(k,...a)=>console.log(k,a),...args) => {
    if(!mgmt)return null;
    await mgmt.patchUserMetadata(user.sub,data,(err,res)=>{
        if(err)k = null;
        k = res;
        fn(k,...args);
    });
}
