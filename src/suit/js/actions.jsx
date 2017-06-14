import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {get, set, has, cloneDeep, omitBy, isNil} from 'lodash';
import {ActiveTableButton} from 'firefly/tables/ui/ActiveTableButton.jsx';
import {getTblById, getTblRowAsObj, makeTblRequest} from 'firefly/tables/TableUtil.js';
import {getViewer} from 'firefly/api/ApiViewer.js';
import {LC} from 'firefly/templates/lightcurve/LcManager.js';
import {FORCEDSOURCE, SOURCE, LSSTCatalogTableType} from 'firefly/visualize/ui/LSSTCatalogSelectViewPanel.jsx';


export function timeSeriesButton() {
    return (
        <div key='launchTimeSeries'>
            <ActiveTableButton
                title = 'Launch Time Series Viewer'
                type = 'highlight'
                onChange = {checkForTimeSeriesData}
                onClick = {launchTimeSeries}
                style= {{maxWidth: 220}}
            />
        </div>
    );
}

function launchTimeSeries({tbl_id, highlightedRow}) {
    const tableModel = getTblById(tbl_id) || {};
    let req;

    if (isTimeSeriesTable(tableModel)) {
        req = cloneDeep(get(tableModel, 'request'));
        req.tbl_id = LC.RAW_TABLE;
        set(req, 'META_INFO.tbl_id', LC.RAW_TABLE);
        req && getViewer(undefined, 'timeseries').showTable(req);
    } else {
        const row = getTblRowAsObj(getTblById(tbl_id), highlightedRow) || {};
        const {mission, tableName, database, objectIdColumn} = get(tableModel, 'tableMeta') || {};
        const objectId = objectIdColumn ? get(row, objectIdColumn, undefined) : undefined; // || row.id;  this yield too many empty table.
        const META_INFO = {[LC.META_MISSION]: mission};
        req = makeTblRequest('LSSTLightCurveQuery', objectId, {objectId, table_name: tableName, database}, {tbl_id: LC.RAW_TABLE, META_INFO});

        if (mission.toLowerCase().includes('wise')) {
           req = req && addExistingConstraints(tableModel, req);
        }

        req && getViewer(undefined, 'timeseries').showTable(req);
    }
}

function addExistingConstraints(tableModel, req) {
    const {SearchMethod, UserTargetWorldPt, constraints, radius, size, ratio, polygon, posang,  sizeUnit} = get(tableModel, ['request']);

    return omitBy(Object.assign(req, {SearchMethod, UserTargetWorldPt, constraints, radius, size, ratio, polygon, posang,  sizeUnit}), isNil);
}

function checkForTimeSeriesData({tbl_id, highlightedRow}) {
    const tableModel = getTblById(tbl_id) || {};

    if (isTimeSeriesTable(tableModel)) {
        return {show: true, title: 'View table as Time Series'};
    } else {
        const row = getTblRowAsObj(getTblById(tbl_id), highlightedRow) || {};
        const {mission, tableType, filterIdColumn, objectIdColumn} = get(tableModel, 'tableMeta', {});
        const objectId = objectIdColumn ? get(row, objectIdColumn, '') : '';
        let   noteForSDSS = '';

        const hasForcedSource = (tt) => {
                var ttype = !tt ? -1 :
                            [SOURCE, FORCEDSOURCE]
                                .findIndex((v) => LSSTCatalogTableType[v].toLowerCase() === tt.toLowerCase());

                return ttype !== -1;
        };

        const showView = () => {
                if (!mission || !hasForcedSource(tableType)) {
                   return false;
                }
                return true;
        };

        const showEnable = () => {   // disable the button for sdss, object, and not i band
                 if (mission.toLowerCase().includes('wise')) return true;
                 const sdssBand = {u: '0', g: '1', r:'2', i: '3', z: '4'};
                 const bShow = filterIdColumn ? get(row, filterIdColumn) === sdssBand.i : true;

                 if (!bShow) {
                     noteForSDSS = ', forced photometry is limited to i-band objects only.';
                 }
                 return bShow;
        };

        const show = showView()&&(!!objectId);

        return {show, enable:show&&showEnable(),  title: `View Time Series: ${objectId}${noteForSDSS}`};
    }
}

function isTimeSeriesTable(tableModel) {
    return Object.keys(get(tableModel, 'tableMeta', {}))
                 .findIndex( (k) => [LC.META_TIME_CNAME, LC.META_FLUX_CNAME, LC.META_MISSION].includes(k)) >=0;

}
