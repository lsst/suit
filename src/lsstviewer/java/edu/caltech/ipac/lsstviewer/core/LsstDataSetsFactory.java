/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */

/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */

/*
 * License information at https://github.com/Caltech-IPAC/firefly/blob/master/License.txt
 */
package edu.caltech.ipac.lsstviewer.core;

import com.google.gwt.user.client.rpc.AsyncCallback;
import com.google.gwt.user.client.ui.Widget;
import edu.caltech.ipac.firefly.data.DataSetInfo;
import edu.caltech.ipac.firefly.data.ImageIntersectionType;
import edu.caltech.ipac.firefly.data.SpacialType;
import edu.caltech.ipac.firefly.data.table.BaseTableColumn;
import edu.caltech.ipac.firefly.data.table.DataSet;
import edu.caltech.ipac.firefly.data.table.TableMeta;
import edu.caltech.ipac.firefly.task.DataSetInfoFactory;
import edu.caltech.ipac.firefly.ui.catalog.Catagory;
import edu.caltech.ipac.firefly.ui.catalog.CatalogData;
import edu.caltech.ipac.firefly.ui.catalog.Proj;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * User: roby
 * Date: Sep 23, 2009
 * Time: 11:39:34 AM
 */

/**
 * @author Trey Roby
 */
public class LsstDataSetsFactory implements DataSetInfoFactory {

    private static BaseTableColumn columns[]= { new BaseTableColumn("projectshort"),
                                                new BaseTableColumn("subtitle"),
                                                new BaseTableColumn("description"),
                                                new BaseTableColumn("server"),
                                                new BaseTableColumn("catname"),
                                                new BaseTableColumn("cols"),
                                                new BaseTableColumn("nrows"),
                                                new BaseTableColumn("coneradius"),
                                                new BaseTableColumn("infourl"),
                                                new BaseTableColumn("ddlink"),
                                                new BaseTableColumn("catSearchProcessor"),
                                                new BaseTableColumn("ddSearchProcessor")
                                             };

    private List<AsyncCallback<List<DataSetInfo>>> responseList = new ArrayList<AsyncCallback<List<DataSetInfo>>>(3);
    private List<DataSetInfo> dataSetInfoList = null;
    private DataSet originalDataSet= null;
    private static LsstDataSetsFactory instance= null;


    public static LsstDataSetsFactory getInstance() {
        if (instance==null) instance= new LsstDataSetsFactory();
        return instance;
    }

    private LsstDataSetsFactory() {};

    public void getAllDataSets(Widget w, AsyncCallback<List<DataSetInfo>> response) {
        if (dataSetInfoList !=null) {
            if (response!=null) response.onSuccess(dataSetInfoList);
        }
        else {
            if (response!=null) responseList.add(response);
            loadTable();
        }
    }

    public boolean isAllDataSetsRetrieved() { return dataSetInfoList!=null;}
    public List<DataSetInfo> getAllDataSetsImmediate() { return dataSetInfoList; }
    public DataSet getOriginalDataSet() { return originalDataSet; }



    private void loadTable() {
//        DataSet ds = DataSetParser.parse(rawDataSet);

        DataSet ds = new DataSet(columns);
        TableMeta meta= new TableMeta();
        meta.setIsLoaded(true);
        ds.setMeta(meta);
        dataSetInfoList= convertToDataSetInfo(ds);
        originalDataSet= ds;
        for(AsyncCallback<List<DataSetInfo>> async : responseList) {
            async.onSuccess(dataSetInfoList);
        }
    }


    private static List<DataSetInfo> convertToDataSetInfo(DataSet ds) {
        CatalogData cData= new CatalogData(ds);
        List<DataSetInfo> retList= new ArrayList<DataSetInfo>(cData.getProjects().size());
        for(Proj proj  : cData.getProjects()) {
            DataSetInfo dsInfo= new DataSetInfo(proj.getShortProjName(), proj.getShortProjName());
            dsInfo.setCatData(proj);
            retList.add(dsInfo);
        }
        addLsstData(retList,ds);
        return retList;
    }

    private static void addLsstData(List<DataSetInfo> dsList, DataSet ds) {



        // Add Image data support for some projects


        // Add test LSST data support
//        List<BaseTableData.RowData> lsstCatalogList= Arrays.asList(
//                Catalog.makeTableRow("lsst","lsst-all","src table", "SERVER","smm_bremerton.src",
//                        "0","2731622","3600","","", "LSSTCatalogQuery","LSSTCatalogDD"),
//                Catalog.makeTableRow("lsst","lsst-all","icSrc table", "SERVER","smm_bremerton.icSrc",
//                        "0","543128","3600","","", "LSSTCatalogQuery","LSSTCatalogDD"),
//                Catalog.makeTableRow("lsst","lsst-all","deepCoadd_ref from MergeMeasurementsTask", "SERVER","smm_bremerton.deepCoadd_ref",
//                        "0","10983","3600","","", "LSSTCatalogQuery","LSSTCatalogDD"),
//                Catalog.makeTableRow("lsst","lsst-all","deepCoadd_meas from MeasureMergedCoaddSourcesTask", "SERVER","smm_bremerton.deepCoadd_meas",
//                        "0","32949","3600","","", "LSSTCatalogQuery","LSSTCatalogDD"),
//                Catalog.makeTableRow("lsst","lsst-all","deepCoadd_forced_src table", "SERVER","smm_bremerton.deepCoadd_forced_src",
//                        "0","32949","1800","","", "LSSTCatalogQuery","LSSTCatalogDD"),
//                Catalog.makeTableRow("lsst","lsst-all","Reference catalog (sdss_dr9.fink_v5b)", "SERVER","sdss_dr9.fink_v5b",
//                        "0","116324519","3600","","", "LSSTCatalogQuery","LSSTCatalogDD")
//        );
//
//        DataSetInfo dsInfo= new DataSetInfo("LSST", "LSST");
//        Proj proj= new Proj("LSST");
//        Catagory catagory= new Catagory("lsst-all");
//        proj.addCatagory(catagory);
//        TableData td= ds.getModel();
//        for(BaseTableData.RowData row : lsstCatalogList) {
//            catagory.addCatalog(new Catalog(row));
//            td.addRow(row);
//        }
//        Set<SpacialType> set= new HashSet<SpacialType>(Arrays.asList(Cone, Box));
//        dsInfo.setCatData(proj,set);
//        dsList.add(dsInfo);




        DataSetInfo squareDsInfo= new DataSetInfo("SQUARE", "SQUARE");
        Proj squareProj= new Proj("SQUARE");
        Catagory squareCatagory= new Catagory("square-all");
        squareProj.addCatagory(squareCatagory);
        Set<SpacialType> stSet= new HashSet<SpacialType>(10);
        addImageData(squareDsInfo, stSet);
        stSet.add(SpacialType.Cone);
        dsList.add(squareDsInfo);





    }

    private static void addImageData(DataSetInfo dsInfo, Set<SpacialType> stSet) {
        Set<ImageIntersectionType> iiSet= new HashSet<ImageIntersectionType>(10);
        iiSet.add(ImageIntersectionType.ImageContainsTarget);
        iiSet.add(ImageIntersectionType.ImageCoversSearchRegion);
        iiSet.add(ImageIntersectionType.SearchRegionEnclosesImage);
        iiSet.add(ImageIntersectionType.ImageTouchesSearchRegion);
        dsInfo.setImageProjInfo(new Object(), stSet, iiSet,new Object());
    }

}

