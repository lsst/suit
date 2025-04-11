import {MetaConst} from 'firefly/data/MetaConst.js';
import {makeFileRequest, MAX_ROW} from 'firefly/tables/TableRequestUtil.js';
import {getTblById, getTblRowAsObj} from 'firefly/tables/TableUtil.js';


export function makeRubinDCERegistryRequest(url, registryTblId) {
    return makeFileRequest('registry', url, undefined,
        {
            pageSize: MAX_ROW,
            tbl_id: registryTblId,
            inclCols:
                '"info_url","collection_label","instrument_name",' +
                '"coverage","band","dataproduct_type",'+
                '"obs_collection","access_url","access_format"',
            META_INFO: {
                // ---- columns widths
                'col.collection_label.PrefWidth':9,
                'col.instrument_name.PrefWidth':9,
                'col.coverage.PrefWidth':8,
                'col.band.PrefWidth':12,
                'col.dataproduct_type.PrefWidth':5,
                'col.info_url.PrefWidth':1,

                // ---- column render
                // eslint-disable-next-line quotes
                'col.info_url.cellRenderer': 'ATag::href=${info_url},target="dce-doc"'+ `,label=<img src='images/info-16x16.png'/>`,


                // ---- column title
                'col.instrument_name.label':'Inst.',
                'col.coverage.label':'Type',
                'col.dataproduct_type.label':'Data',
                'col.collection_label.label':'Collection',
                'col.band.label':'Bands',
                'col.info_url.label':'i',

                // ---- column tooltip
                'col.info_url.desc':'Information and help page for this collection',
                'col.instrument_name.desc':'Instrument name',
                'col.dataproduct_type.desc':'Data product type- images, spectrum, etc',

                // ---- column visible or hidden
                // not all the hidden columns are necessary returned anymore because of inclCols, keeping it here for documentation
                'col.obs_collection.visibility':'hidden',
                'col.description.visibility':'hidden',
                'col.desc_details.visibility':'hidden',
                'col.access_url.visibility':'hide',
                'col.access_format.visibility':'hidden',

                [MetaConst.IMAGE_SOURCE_ID] : 'FALSE'
            }
        }
    );
}

export function getRubinDCECollectionAttributes(registryTblId, rowIdx) {
    const table= getTblById(registryTblId);
    if (!table) return {};
    const {band,coverage}= getTblRowAsObj(table,rowIdx);
    return {bandDesc:band, coverage};
}
