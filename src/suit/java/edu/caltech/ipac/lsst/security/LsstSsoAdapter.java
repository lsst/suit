/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
package edu.caltech.ipac.lsst.security;

import edu.caltech.ipac.firefly.data.userdata.UserInfo;
import edu.caltech.ipac.firefly.server.RequestAgent;
import edu.caltech.ipac.firefly.server.ServerContext;
import edu.caltech.ipac.firefly.server.network.HttpServiceInput;
import edu.caltech.ipac.firefly.server.security.SsoAdapter;
import edu.caltech.ipac.firefly.server.util.Logger;
import edu.caltech.ipac.util.AppProperties;
import edu.caltech.ipac.util.StringUtils;
import org.json.simple.parser.JSONParser;

import java.util.Base64;
import java.util.Map;
import java.util.UUID;

import static edu.caltech.ipac.util.StringUtils.isEmpty;
import static edu.caltech.ipac.firefly.core.Util.Try;

/**
 * This class support authentication for LSST PDAC deployment using a custom AUTH_PROXY
 *
 * @author loi
 */
public class LsstSsoAdapter implements SsoAdapter {
    private static Logger.LoggerImpl LOGGER = Logger.getLogger();
    private static String LOGIN_URL         = AppProperties.getProperty("sso.login.url", "/login?rd=/portal/suit/");
    private static String LOGOUT_URL        = AppProperties.getProperty("sso.logout.url", "/logout");
    private static String REQ_AUTH_HOSTS    = AppProperties.getProperty("sso.req.auth.hosts", ".ncsa.illinois.edu,.lsst.cloud");

    private static final String GROUPS_HEADER = "X-Auth-Request-Groups";
    private static final String EMAIL_HEADER = "X-Auth-Request-Email";
    private static final String NAME_HEADER = "X-Auth-Request-Name";
    private static final String TOKEN_HEADER = "X-Auth-Request-Token";
    private static final String USERNAME_HEADER = "X-Auth-Request-User";

    // the keywords are listed in https://confluence.lsstcorp.org/display/LAAIM/Web+SSO
    private static final String USER_NAME = "sub"; // ex.value "http://cilogon.org/serverT/users/123456'
    private static final String UID = "uid"; // ex.value "username"
    private static final String NAME = "name";
    private static final String EMAIL = "email";
    private static final String EXPIRES = "exp";
    private static final String ID_TOKEN = "X-Auth-Request-Token";
    private static final String[] reqAuthHosts = REQ_AUTH_HOSTS.split(",");

    private Token token = null;

    public Token getAuthToken() {
        if (token == null) {
            try {
                RequestAgent ra = ServerContext.getRequestOwner().getRequestAgent();
                String id_token = getString(ra, TOKEN_HEADER, "");      // this is a 3-parts base64 encoded JWT token
                if (isEmpty(id_token)) {
                    return null;
                }
                String[] parts = id_token.split("\\.");
                if (parts.length == 3) {
                    String jsonContent = new String(Base64.getDecoder().decode(parts[1]));
                    //LOGGER.debug("CILogon User Info: " + jsonContent);
                    Map claims = (Map) new JSONParser().parse(jsonContent);
                    token = new Token(String.valueOf(claims.get(USER_NAME)));
                    token.setExpiresOn(StringUtils.getInt(claims.get(EXPIRES), 0));
                    token.set(EMAIL, String.valueOf(claims.get(EMAIL)));
                    token.set(NAME, String.valueOf(claims.get(NAME)));
                    token.set(UID, String.valueOf(claims.get(UID)));
                    token.set(ID_TOKEN, id_token);

                    return token;
                } else {
                    String email = getString(ra, EMAIL_HEADER, null);
                    String username = getString(ra, USERNAME_HEADER, email);
                    if (isEmpty(username))  username = UUID.randomUUID().toString();       // all fail, use a random unique id
                    token = new Token(username);
                    token.setExpiresOn(0);
                    token.set(EMAIL, email);
                    token.set(NAME, getString(ra, NAME_HEADER, null));
                    token.set(UID, username);
                    token.set(ID_TOKEN, id_token);

                    return token;
                }
            } catch (Exception e) {
                LOGGER.error(e);
            }
        }
        return token;
    }

    public UserInfo getUserInfo() {
        Token token = getAuthToken();
        if (token != null) {
            UserInfo user = new UserInfo();
            //user.setLoginName(token.getId());
            user.setLoginName(token.get(UID));
            user.setEmail(token.get(EMAIL));
            String name = token.get(NAME) == null ? "" : token.get(NAME);
            String[] parts = name.split(" ");
            String firstName = parts.length > 0 ? parts[0] : "";
            String lastName = parts.length > 1 ? parts[1] : firstName;
            user.setFirstName(firstName);
            user.setLastName(lastName);
            return user;
        }
        return null;
    }

    public void setAuthCredential(HttpServiceInput inputs) {
//        // to test from a local machine, obtain temptoken and set it directly,
//        // you also need to set
//        String tempToken = "short token here";
//        inputs.setHeader("Authorization", "Bearer " + tempToken);
        Token token = getAuthToken();
        if (token != null && token.get(ID_TOKEN) != null) {
            if (SsoAdapter.requireAuthCredential(inputs.getRequestUrl(), reqAuthHosts)) {
                inputs.setHeader("Authorization", "Bearer " + token.get(ID_TOKEN));
            }
        }
    }

    public String getLoginUrl(String backTo) {
        return ServerContext.resolveUrl(LOGIN_URL);
    }

    public String getLogoutUrl(String backTo) {
        return ServerContext.resolveUrl(LOGOUT_URL);
    }

//====================================================================
//
//====================================================================

    private static String getString(RequestAgent ra, String key, String def) {
        return ra.getHeader(key, def);
    }
}

