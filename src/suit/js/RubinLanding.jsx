import {Card, IconButton, Sheet, Stack, Typography} from '@mui/joy';
import React, {useContext, useState} from 'react';
import {getBackgroundInfo} from 'firefly/core/background/BackgroundUtil.js';
import {dispatchShowDropDown} from 'firefly/core/LayoutCntlr.js';
import {AppPropertiesCtx} from 'firefly/ui/AppPropertiesCtx.jsx';
import {useStoreConnector} from 'firefly/ui/SimpleComponent.jsx';
import {FileDropZone} from 'firefly/visualize/ui/FileUploadViewPanel.jsx';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import NorthRoundedIcon from '@mui/icons-material/NorthRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PORTAL_SYMBOL from '../html/images/portal-symbol.svg';
import RUBIN from '../html/images/rubin-imagotype-color-on-black.svg'

export function RubinLanding() {
    const {appTitle,footer,showLandingHelp=true,
        fileDropEventAction='FileUploadDropDownCmd'} = useContext(AppPropertiesCtx);
    const [dropEvent, setDropEvent] = useState(undefined);
    const {jobs = {}} = useStoreConnector(() => getBackgroundInfo());

    const items = Object.values(jobs)
        .filter((job) => job.jobInfo?.monitored && job.jobInfo?.type !== 'PACKAGE');
    const haveBgJobs = items.length > 0;

    return (
        <Sheet className='ff-ResultsPanel-StandardView' sx={{width: 1, height: 1}}>
            <FileDropZone {...{
                dropEvent, setDropEvent,
                setLoadingOp: () => {
                    const newEv = {type: 'drop', dataTransfer: {files: Array.from(dropEvent.dataTransfer.files)}};
                    dispatchShowDropDown({fileDropEventAction, initArgs: {searchParams: {dropEvent: newEv}}});
                },
            }}>
                <Stack {...{justifyContent:'space-between', width:1, height:1}}>
                    <Stack {...{spacing:2, width:1, height:1 }}>
                        <Stack {...{direction: 'row', justifyContent: 'space-between'}}>
                            {showLandingHelp &&
                                <Stack {...{alignSelf: 'flex-start', alignItems: 'center', spacing: 0, sx: {pt: 1, pl: 16}}}>
                                    <NorthRoundedIcon {...{sx: {width: '2rem', height: '2rem'}}}/>

                                    <Stack {...{direction: 'row',}}>
                                        <Typography level='title-sm'> Choose Search from menu </Typography>
                                    </Stack>
                                    <Typography level='body-md'>or</Typography>
                                    <Stack {...{direction: 'row', spacing: 1}}>
                                        <Typography level='title-md'>use</Typography>
                                        <IconButton disabled={true} variant='outlined'>
                                            <MenuRoundedIcon/>
                                        </IconButton>
                                        <Typography level='title-md'> to see the full list of searches </Typography>
                                    </Stack>
                                    <Typography level='body-md'>or</Typography>
                                    <Typography level='title-md'> Drop a file anywhere</Typography>
                                </Stack>
                            }
                            {/*<Card variant='solid' color='neutral'>*/}
                            {/*    <img src={RUBIN} style={{width:150}}/>*/}
                            {/*</Card>*/}
                            {haveBgJobs ?
                                <Stack {...{alignSelf: 'flex-start', alignItems: 'center', spacing: 1, sx: {pt: 1, pr: 2}}}>
                                    <NorthRoundedIcon {...{sx: {width: '3rem', height: '3rem'}}}/>
                                    <Typography level='title-lg'>Load jobs from </Typography>
                                    <Typography level='title-lg'>Background Monitor </Typography>
                                </Stack> : <div/>}
                        </Stack>

                        <Stack {...{alignItems: 'center', height:1, justifyContent: 'space-between', pb:4}}>
                            <Stack {...{alignItems: 'center', spacing: 3}}>
                                <Typography sx={{fontSize: '4rem'}} color='neutral'>
                                    Rubin Science Platform Portal
                                </Typography>
                                {/*<Typography sx={{fontSize: '4rem'}} color='neutral'>*/}
                                {/*    Portal*/}
                                {/*</Typography>*/}
                                <Typography level={'h4'}>No Search Results Yet</Typography>
                                <img src={PORTAL_SYMBOL} style={{width:200}}/>
                            </Stack>
                            <Stack {...{alignItems: 'center', spacing: 1}}>
                                <Typography level={'body-lg'} startDecorator={<InfoOutlinedIcon/>}>
                                    Note: This landing page is still being developed
                                </Typography>
                            </Stack>
                        </Stack>
                    </Stack>
                    {footer ? footer : undefined}
                </Stack>
            </FileDropZone>
        </Sheet>
    );
}