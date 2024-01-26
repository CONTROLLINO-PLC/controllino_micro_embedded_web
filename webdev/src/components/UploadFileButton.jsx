import React, { useRef, useState } from 'react';
import {Grid} from '@mui/material';
import { Button, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import GetApp from '@mui/icons-material/GetApp';

const StyledInput = styled('input')({
 display: 'none',
});

const classes = {
      button_u: {
        borderRadius: '5px', 
        background: 'yellow', 
        color: '#000000',
        width: '86%',
        marginTop: '3%',
        marginLeft: 15,
        marginBottom: 3,
      },
    text_u: {
        marginLeft: 15,
        marginTop: '3%',
        display: 'flex',
        justifyContent: 'left',
        flexDirection: 'column',
        color: 'white',
    },
    info_u:{
        fontSize: 16,
        marginBottom: 6,
        fontWeight: 'blond',
        fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
    },
    icon_u:{
        color: 'black',
        fontSize: 23,
        margin: 8
    },

};

function UploadFileButton({ onExecuteParentFunction }) {
 const [upload, setUpload] = useState(null); // Upload promise
 const [status, setStatus] = useState('');   // Current upload status
 const btn = useRef(null);
 const input = useRef(null);

 const onupload = function(ok, name, size) {
    if (!ok) return false;
    onExecuteParentFunction();
  };

  // Send a large file chunk by chunk
  const sendFileData = function(url, fileName, fileData, chunkSize) {
    return new Promise(function(resolve, reject) {
      const finish = ok => {
        setUpload(null);
        const res = onupload ? onupload(ok, fileName, fileData.length) : null;
        if (res && typeof (res.catch) === 'function') {
          res.catch(() => false).then(() => ok ? resolve() : reject());
        } else {
          ok ? resolve() : reject();
        }
      };
      const sendChunk = function(offset) {
        var chunk = fileData.subarray(offset, offset + chunkSize) || '';
        var opts = {method: 'POST', body: chunk};
        var fullUrl = url + '?offset=' + offset +
          '&total=' + fileData.length  +
          '&name=' + encodeURIComponent(fileName);
        var ok;
        setStatus('Uploading ' + fileName + ', bytes ' + offset + /*'..' +
          (offset + chunk.length) + */' of ' + fileData.length);
        fetch(fullUrl, opts)
          .then(function(res) {
            if (res.ok && chunk.length > 0) sendChunk(offset + chunk.length);
            ok = res.ok;
            return res.text();
          })
          .then(function(text) {
            if (!ok) setStatus('Error: ' + text), finish(ok); // Fail
            if (chunk.length > 0) return; // More chunks to send
            setStatus(x => x + '. Done!');
            finish(ok); // All chunks sent
          });
      };
      sendChunk(0);
    });
  };

  const onchange = function(ev) {
    if (!ev.target.files[0]) return;
    let r = new FileReader(), f = ev.target.files[0];
    r.readAsArrayBuffer(f);
    r.onload = function() {
      setUpload(sendFileData('/api/firmware/upload', f.name, new Uint8Array(r.result), 2048));
      ev.target.value = '';
      ev.preventDefault();
    if (btn.current) btn.current.click();
    // btn && btn.current.click();
    };
  };

  const onclick = function(ev) {
    let fn; setUpload(x => fn = x);
    if (!fn) input.current.click();  // No upload in progress, show file dialog
    return fn;
  };


 return (
    <div className="inline-flex flex-col">

        <StyledInput type="file" ref={input} onChange={onchange} accept="*" />

            <Grid item xs={8} sm={8} md={8} lg={8} xl={12}>
                <Button onClick={onclick} ref={btn} style={classes.button_u}
                    variant='contained'
                    id='upload'
                >
                    Upload new firmware: choose .bin file
                <GetApp style={classes.icon_u}/>
                </Button>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={classes.text_u}>
                <div style={classes.info_u}>
                    {status}
                </div>
            </Grid>
    </div>
 );
};

export default UploadFileButton;
