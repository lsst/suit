import {makeSearchAction, SearchTypes} from 'firefly/core/ClickToAction.js';
import {showTapSearchPanel} from 'firefly/ui/DefaultSearchActions.js';
import {getTapServices} from 'firefly/ui/tap/TapUtil.js';
import {makeWorldPt} from 'firefly/visualize/Point.js';
import React from 'react';
import {get, omitBy, isNil} from 'lodash';
import {ActiveTableButton} from 'firefly/tables/ui/ActiveTableButton.jsx';
import {getTblById, getTblRowAsObj} from 'firefly/tables/TableUtil.js';
import {LC} from 'firefly/templates/lightcurve/LcManager.js';


// export function timeSeriesButton() {
//     return (
//         <div key='launchTimeSeries'>
//             <ActiveTableButton
//                 title = 'Launch Time Series Viewer'
//                 type = 'highlight'
//                 onChange = {checkForTimeSeriesData}
//                 onClick = {() => console.log('add a new launchTimeSeries function')}
//                 style= {{maxWidth: 220}}
//             />
//         </div>
//     );
// }
//
// function launchTimeSeries({tbl_id, highlightedRow}) {
//     const tableModel = getTblById(tbl_id) || {};
//     let req;
//
//     if (isTimeSeriesTable(tableModel)) {
//         req = cloneDeep(get(tableModel, 'request'));
//         req.tbl_id = LC.RAW_TABLE;
//         set(req, 'META_INFO.tbl_id', LC.RAW_TABLE);
//         req && getViewer(undefined, 'timeseries').showTable(req);
//     } else {
//         const row = getTblRowAsObj(getTblById(tbl_id), highlightedRow) || {};
//         const {mission, tableName, database, objectIdColumn} = get(tableModel, 'tableMeta') || {};
//         const objectId = objectIdColumn ? get(row, objectIdColumn, undefined) : undefined;
//
//         if (!isNil(objectId)) {
//             const META_INFO = {[LC.META_MISSION]: mission};
//
//             req = makeTblRequest('LSSTLightCurveQuery', objectId, {objectId, table_name: tableName, database}, {tbl_id: LC.RAW_TABLE, META_INFO});
//
//             if (mission.toLowerCase().includes('wise')) {
//                 req = req && addExistingConstraints(tableModel, req);
//             }
//
//             req && getViewer(undefined, 'timeseries').showTable(req);
//         }
//     }
// }

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
                const ttype = !tt ? -1 :
                            ['source', 'forcedSource']
                                .findIndex((v) => v.toLowerCase() === tt.toLowerCase());

                return ttype !== -1;
        };

        const showView = () => {
                return !(!mission || !hasForcedSource(tableType));
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

        const show = showView();

        return {show, enable:(!!objectId)&&show&&showEnable(),  title: `View Time Series: ${objectId}${noteForSDSS}`};
    }
}

function isTimeSeriesTable(tableModel) {
    return Object.keys(get(tableModel, 'tableMeta', {}))
                 .findIndex( (k) => [LC.META_TIME_CNAME, LC.META_FLUX_CNAME, LC.META_MISSION].includes(k)) >=0;

}

const LSST_TAP_LABEL= 'LSST DP0.2 DC2';

function getLsstTapServiceUrl() {
    const url= getTapServices().filter( ({label}) => label===LSST_TAP_LABEL)?.[0]?.value;
    return url;
}

export function makeLsstClickToAction() {

    return [
        makeSearchAction('lsstObsCoreTap', 'lsst-tap', 'ObsTAP for Images', 'Search ObsTAP', SearchTypes.point, .001, 2.25,
            (sa, cenWpt, radius) => {
                showTapSearchPanel( {wp: cenWpt, serviceUrl: getLsstTapServiceUrl(),
                    schema:'ivoa', table:'ivoa.ObsCore'});
            }),
        makeSearchAction('lsstTruthSummaryRadius', 'lsst-tap', 'Truth Summary TAP ', 'Search truth summary', SearchTypes.pointRadius, .001, 2.25,
            (sa, cenWpt, radius) => {
                showTapSearchPanel( {wp: cenWpt, radiusInArcSec: radius, serviceUrl: getLsstTapServiceUrl(),
                    schema:'dp02_dc2_catalogs', table:'dp02_dc2_catalogs.TruthSummary'});
            }),
        makeSearchAction('lsstTruthSummaryArea', 'lsst-tap', 'Truth Summary TAP ', 'Search truth summary', SearchTypes.area, undefined, undefined,
            (sa, cenWpt, radius, corners) => {
                showTapSearchPanel( {corners, serviceUrl: getLsstTapServiceUrl(),
                    schema:'dp02_dc2_catalogs', table:'dp02_dc2_catalogs.TruthSummary'});
            }, 'Search TruthSummary table within the specified polygon'),
        makeSearchAction('lsstObsCoreTapTable', 'lsst-tap', 'Obscore TAP', 'TAP Search',
            SearchTypes.point_table_only, undefined, undefined,
            (sa, wp) => showTapSearchPanel( {wp, serviceUrl: getLsstTapServiceUrl(), schema:'ivoa', table:'ivoa.ObsCore'}),
            'Search ObsTAP for images at row'),
        makeSearchAction('lsstTruthSummaryRadiusTable', 'lsst-tap', 'TAP', 'Truth Summary TAP',
            SearchTypes.point_table_only, undefined, undefined,
            (sa, wp) => showTapSearchPanel( {wp, radiusInArcSec: 5/3600,
                serviceUrl: getLsstTapServiceUrl(), schema:'dp02_dc2_catalogs', table:'dp02_dc2_catalogs.TruthSummary'}),
            'Search Truth Summary table with 5" radius' ),
    ];
}




export function makeLsstTapEntry() {

    return (
        {
            label: LSST_TAP_LABEL,
            value: 'https://data-int.lsst.cloud/api/tap',
            fovDeg: 10,
            centerWP: makeWorldPt(62,-37).toString(),
            hipsUrl: 'https://irsa.ipac.caltech.edu/data/hips/list',
            examples: [
                {
                    description: 'Query the object table to get positions and composite model magnitudes and their errors in three filters using a CONE search to define a region on the sky. Filter on deblended sources with i-band magnitudes brighter than 25 mag.',
                    statement:
                        `SELECT objectId, coord_ra, coord_dec, detect_isPrimary, 
scisql_nanojanskyToAbMag(g_cModelFlux) as gmag, scisql_nanojanskyToAbMag(i_cModelFlux) as imag,
scisql_nanojanskyToAbMag(r_cModelFlux) as rmag,
scisql_nanojanskyToAbMagSigma(g_cModelFlux, g_cModelFluxErr) as gmag_err,
scisql_nanojanskyToAbMagSigma(i_cModelFlux, i_cModelFluxErr) as imag_err,
scisql_nanojanskyToAbMagSigma(r_cModelFlux, r_cModelFluxErr) as rmag_err
FROM dp02_dc2_catalogs.Object
WHERE CONTAINS (POINT('ICRS', coord_ra, coord_dec), CIRCLE('ICRS', 62.0, -37.0, 0.05)) = 1
AND detect_isPrimary = 1`
                },
                {
                    description: 'Jointly query the DiaSource and CcdVisit tables to obtain the magnitudes of all of the i-band detections in difference images (DiaSources) for a time-domain event within 2 arcsec of (67.4579, -44.0802), and the associated seeing and visitId.',
                    statement:
                        `SELECT diasrc.ra, diasrc.decl, diasrc.diaObjectId, diasrc.diaSourceId, diasrc.filterName, diasrc.midPointTai,
scisql_nanojanskyToAbMag(diasrc.psFlux) AS psAbMag,
ccdvis.seeing, ccdvis.visitId
FROM dp02_dc2_catalogs.DiaSource AS diasrc JOIN dp02_dc2_catalogs.CcdVisit AS ccdvis
ON diasrc.ccdVisitId = ccdvis.ccdVisitId
WHERE CONTAINS(POINT('ICRS', diasrc.ra, diasrc.decl), CIRCLE('ICRS', 67.4579, -44.0802, 0.0006))=1
AND diasrc.filterName = 'i'`
                },
                {
                    description: 'Query for processed visit images (calexps) that overlap the coordinate (62, -37) and were obtained in the r-band filter between modified Julian dates 60900 and 61000.',
                    statement:
                        `SELECT dataproduct_type, dataproduct_subtype, calib_level, lsst_band, em_min, em_max, 
lsst_tract, lsst_patch, lsst_visit, lsst_filter, lsst_detector, t_exptime, t_min, t_max, s_ra, s_dec, s_fov, 
obs_id, obs_collection, o_ucd, facility_name, instrument_name, s_region, access_url, access_format 
FROM ivoa.ObsCore 
WHERE CONTAINS(POINT('ICRS', 62, -37), s_region)=1 
AND calib_level = 2 
AND dataproduct_type = 'image' 
AND ( t_min <= 61000 AND 60900 <= t_max ) 
AND ( 600e-9 BETWEEN em_min AND em_max )`
                },
            ]
        });
};
