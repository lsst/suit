import React from 'react';
import {get, set, cloneDeep} from 'lodash';
import {ActiveTableButton} from 'firefly/tables/ui/ActiveTableButton.jsx';
import {getTblById, getTblRowAsObj, makeTblRequest} from 'firefly/tables/TableUtil.js';
import {getViewer} from 'firefly/api/ApiViewer.js';
import {LC} from 'firefly/templates/lightcurve/LcManager.js';


export function timeSeriesButton() {
    return (
        <div key='launchTimeSeries'>
            <ActiveTableButton
                title = 'Launch Time Series Viewer'
                type = 'highlight'
                onChange = {checkForTimeSeriesData}
                onClick = {launchTimeSeries}
            />
        </div>
    );
}

function launchTimeSeries({tbl_id, highlightedRow}) {
    const tableModel = getTblById(tbl_id) || {};
    if (isTimeSeriesTable(tableModel)) {
        const req = cloneDeep(get(tableModel, 'request'));
        req.tbl_id = LC.RAW_TABLE;
        set(req, 'META_INFO.tbl_id', LC.RAW_TABLE);
        req && getViewer(undefined, 'timeseries').showTable(req);
    } else {
        const row = getTblRowAsObj(getTblById(tbl_id), highlightedRow) || {};
        const objectId = row.objectId; // || row.id;  this yield too many empty table.
        const META_INFO = {[LC.META_MISSION]: 'lsst_sdss'};
        const req = makeTblRequest('LSSTLightCurveQuery', objectId, {objectId}, {tbl_id: LC.RAW_TABLE, META_INFO});
        getViewer(undefined, 'timeseries').showTable(req);
    }
}

function checkForTimeSeriesData({tbl_id, highlightedRow}) {
    const tableModel = getTblById(tbl_id) || {};
    if (isTimeSeriesTable(tableModel)) {
        return {show: true, title: 'View table as Time Series'};
    } else {
        const row = getTblRowAsObj(getTblById(tbl_id), highlightedRow) || {};
        const objectId = row.objectId; // || row.id;  this yield too many empty table.
        return {show: Boolean(objectId), title: `View Time Series: ${objectId}`};
    }
}

function isTimeSeriesTable(tableModel) {
    return Object.keys(get(tableModel, 'tableMeta', {}))
                 .findIndex( (k) => [LC.META_TIME_CNAME, LC.META_FLUX_CNAME, LC.META_MISSION].includes(k)) >=0;

}