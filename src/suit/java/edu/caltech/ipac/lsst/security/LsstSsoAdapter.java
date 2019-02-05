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

import java.util.Arrays;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * This class support authentication for LSST PDAC deployment using a custom AUTH_PROXY
 *
 * @author loi
 */
public class LsstSsoAdapter implements SsoAdapter {
    private static Logger.LoggerImpl LOGGER = Logger.getLogger();
    private static String LOGIN_URL         = AppProperties.getProperty("sso.login.url", "/oauth2/start?rd=/portal/suit/");
    private static String LOGOUT_URL        = AppProperties.getProperty("sso.logout.url", "/oauth2/sign_in");
    private static String REQ_AUTH_HOSTS    = AppProperties.getProperty("sso.req.auth.hosts", ".ncsa.illinois.edu");

    private static final String ID_TOKEN = "X-Auth-Request-Token";

    private static final String USER_NAME = "sub";
    private static final String UID = "uidNumber";
    private static final String MEMBER_OF = "isMemberOf";
    private static final String NAME = "name";
    private static final String EMAIL = "email";
    private static final String EXPIRES = "exp";
    private static final String[] reqAuthHosts = REQ_AUTH_HOSTS.split(",");

    private Token token = null;

    public Token getAuthToken() {
        if (token == null) {
            try {
                RequestAgent ra = ServerContext.getRequestOwner().getRequestAgent();
                String id_token = getString(ra, ID_TOKEN, "");      // this is a 3-parts base64 encoded JWT token
                String[] parts = id_token.split("\\.");
                if (parts.length == 3) {
                    Map claims = (Map) new JSONParser().parse(new String(Base64.getDecoder().decode(parts[1])));
                    token = new Token(String.valueOf(claims.get(USER_NAME)));
                    token.setExpiresOn(StringUtils.getInt(claims.get(EXPIRES), 0));
                    token.set(EMAIL, String.valueOf(claims.get(EMAIL)));
                    token.set(NAME, String.valueOf(claims.get(NAME)));
                    token.set(UID, String.valueOf(claims.get(UID)));
                    token.set(ID_TOKEN, id_token);

                    try {
                        List<Map<String,String>> memberOf = (List<Map<String,String>>) claims.get(MEMBER_OF);
                        if (memberOf != null && memberOf.size() > 0) {
                            String val = memberOf.stream().filter(e -> e.containsKey("id"))
                                    .map(e -> e.get("name")).collect(Collectors.joining(","));
                            token.set(MEMBER_OF, val);
                        }
                    } catch (Exception ex) {
                        // ignore for now.
                    }
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
            user.setLoginName(token.getId());
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

