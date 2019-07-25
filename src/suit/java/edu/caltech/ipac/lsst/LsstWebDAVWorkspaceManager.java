package edu.caltech.ipac.lsst;

import edu.caltech.ipac.firefly.data.WspaceMeta;
import edu.caltech.ipac.firefly.server.WebDAVWorkspaceManagerBase;
import edu.caltech.ipac.firefly.server.network.HttpServiceInput;
import edu.caltech.ipac.firefly.server.ws.WsCredentials;
import edu.caltech.ipac.util.AppProperties;

import java.util.Map;

/**
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 *
 * @author tatianag
 */
public class LsstWebDAVWorkspaceManager extends WebDAVWorkspaceManagerBase {

    private static String WS_ROOT_PATH = AppProperties.getProperty("workspace.root.path", "/dav");

    private WsCredentials creds;
    private String userHome;

    public LsstWebDAVWorkspaceManager(String wsId) {

        Map<String, String> cookies = HttpServiceInput.createWithCredential(getWsHostUrl()).getCookies();          // should look at this again.
        // for development from a local machine, set wsId to your user name
        // if (wsId == null || wsId.equals("Guest")) wsId = "tatianag";
        this.creds = new WsCredentials(wsId, cookies);
        this.userHome = WspaceMeta.ensureWsHomePath(wsId);
    }

    public LsstWebDAVWorkspaceManager(WsCredentials cred) {
        this(cred.getWsId());
    }

    @Override
    public WsCredentials getCredentials() {
        return this.creds;
    }

    @Override
    public String getWsHome() {
        return WS_ROOT_PATH + this.userHome;
    }

    // namespace is only used to set and save properties,
    // this feature is not used in the current implementation

    @Override
    protected String getNamespacePrefix() {
        return "lsst";
    }

    @Override
    protected String getNamespaceUri() {
        return getWsHostUrl()+"/namespace/";
    }
}
