package edu.caltech.ipac.lsstviewer.server.query;

import edu.caltech.ipac.firefly.data.Param;
import edu.caltech.ipac.firefly.data.ServerRequest;
import edu.caltech.ipac.firefly.data.TableServerRequest;
import edu.caltech.ipac.firefly.server.query.DataAccessException;
import edu.caltech.ipac.firefly.server.query.IpacTableFromExternalTask;
import edu.caltech.ipac.firefly.server.query.SearchProcessorImpl;
import edu.caltech.ipac.util.StringUtils;
import org.json.simple.JSONObject;

import java.io.File;
import java.io.IOException;

/**
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 *
 * @author tatianag
 */
@SearchProcessorImpl(id = "ImageMetadataFromPythonTask")
public class ImageMetadataFromPythonTask extends IpacTableFromExternalTask {

    private static String EXCLUDE_PARAMS = "|" + StringUtils.toString(new String[]{"task", "searchType", ServerRequest.ID_KEY})+"|";

    @Override
    protected File loadDataFile(TableServerRequest request) throws IOException, DataAccessException {
        TableServerRequest sreq = new TableServerRequest("TableFromExternalTask");
        sreq.setParam("launcher","python");
        sreq.setParam("task", request.getParam("task"));

        JSONObject taskParams=new JSONObject();
        for (Param p : request.getParams()) {
            if (EXCLUDE_PARAMS.contains("|"+p.getName()+"|")) {
                continue;
            } else if (request.isInputParam(p.getName())) {
                taskParams.put(p.getName(), p.getValue());
            }
        }
        sreq.setParam("taskParams", taskParams.toJSONString());

        return super.loadDataFile(sreq);
    }
}
