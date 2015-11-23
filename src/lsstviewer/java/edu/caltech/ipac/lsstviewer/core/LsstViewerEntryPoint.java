package edu.caltech.ipac.lsstviewer.core;

import com.google.gwt.core.client.EntryPoint;
import edu.caltech.ipac.fftools.core.FireflyToolsEntryPoint;
import edu.caltech.ipac.firefly.commands.ImageSelectDropDownCmd;

/**
 * User: roby
 * Date: 11/18/11
 * Time: 2:15 PM
 */

/**
 * @author Trey Roby
 */
public class LsstViewerEntryPoint implements EntryPoint {

    public void onModuleLoad() {
        FireflyToolsEntryPoint fftoolsEntry = new FireflyToolsEntryPoint();
        fftoolsEntry.setAppHelpName("lsstviewer");
//        fftoolsEntry.setEventMode(Application.EventMode.POLL);
        fftoolsEntry.start(LsstDataSetsFactory.getInstance(), 2,
                        "irsa_footer_minimal.html",
                        ImageSelectDropDownCmd.COMMAND_NAME);
    }

}

