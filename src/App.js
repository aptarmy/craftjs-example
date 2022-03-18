import React, { useState } from 'react';
import {Typography, Paper, Grid} from '@material-ui/core';

import { Toolbox } from './components/Toolbox';
import { SettingsPanel } from './components/SettingsPanel';
import { Topbar } from './components/Topbar';

import { Container } from './components/user/Container';
import { Button } from './components/user/Button';
import { Card, CardTop, CardBottom } from './components/user/Card';
import { Text } from './components/user/Text';

import {Editor, Frame, Element, useEditor} from "@craftjs/core";

const editorResolver = {Card, CardTop, CardBottom, Button, Text, Container};

const renderPreloadedJson = jsonData => {
  jsonData = JSON.parse(jsonData);
  const renderElm = nodeData => {
    console.log('rendering nodeData:', nodeData);
    return React.createElement(editorResolver[nodeData.type.resolvedName], nodeData.props, ...nodeData.nodes.map(node => renderElm(jsonData[node])));
  };
  return renderElm(jsonData['ROOT']);
}

const jsonData = `{"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"background":"#eee","padding":5},"displayName":"Container","custom":{},"hidden":false,"nodes":["qGLXv9XL5v","sjwseFZwyk","oYtHXr1tB9","m2MBv_E48v","HlFKQwiCjL","ydNkT2Ccvh","myAF3NJrQk","n-DeTbOAHf"],"linkedNodes":{}},"HlFKQwiCjL":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"I am Arm","fontSize":29,"size":"small"},"displayName":"Text","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"ydNkT2Ccvh":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"background":"#e88a2e","padding":2},"displayName":"Container","custom":{},"parent":"ROOT","hidden":false,"nodes":["nQ0BYM2O9E","5PzaAVQkZT"],"linkedNodes":{}},"5PzaAVQkZT":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"It's me again!","fontSize":43,"size":"small"},"displayName":"Text","custom":{},"parent":"ydNkT2Ccvh","hidden":false,"nodes":[],"linkedNodes":{}},"m2MBv_E48v":{"type":{"resolvedName":"Button"},"isCanvas":false,"props":{"size":"large","variant":"contained","color":"primary","text":"Click me"},"displayName":"Button","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"nQ0BYM2O9E":{"type":{"resolvedName":"Button"},"isCanvas":false,"props":{"size":"small","variant":"contained","color":"primary","text":"Click me"},"displayName":"Button","custom":{},"parent":"ydNkT2Ccvh","hidden":false,"nodes":[],"linkedNodes":{}},"myAF3NJrQk":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"Okay let's go","fontSize":20},"displayName":"Text","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"sjwseFZwyk":{"type":{"resolvedName":"Button"},"isCanvas":false,"props":{"size":"medium","variant":"outlined","color":"default","text":"Click me"},"displayName":"Button","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"oYtHXr1tB9":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"Hi world","fontSize":20},"displayName":"Text","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"qGLXv9XL5v":{"type":{"resolvedName":"Button"},"isCanvas":false,"props":{"size":"small","variant":"contained","color":"secondary","text":"Click me"},"displayName":"Button","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"n-DeTbOAHf":{"type":{"resolvedName":"Card"},"isCanvas":false,"props":{},"displayName":"Card","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{"text":"4xQSHF9AIX","buttons":"DTHVBlj8u8"}},"4xQSHF9AIX":{"type":{"resolvedName":"CardTop"},"isCanvas":true,"props":{},"displayName":"CardTop","custom":{},"parent":"n-DeTbOAHf","hidden":false,"nodes":["a8DgGDiLQ6","4w_TOTK7Hd"],"linkedNodes":{}},"a8DgGDiLQ6":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"Title","fontSize":20},"displayName":"Text","custom":{},"parent":"4xQSHF9AIX","hidden":false,"nodes":[],"linkedNodes":{}},"4w_TOTK7Hd":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"Subtitle","fontSize":15},"displayName":"Text","custom":{},"parent":"4xQSHF9AIX","hidden":false,"nodes":[],"linkedNodes":{}},"DTHVBlj8u8":{"type":{"resolvedName":"CardBottom"},"isCanvas":true,"props":{},"displayName":"CardBottom","custom":{},"parent":"n-DeTbOAHf","hidden":false,"nodes":["VF24Gwi94O"],"linkedNodes":{}},"VF24Gwi94O":{"type":{"resolvedName":"Button"},"isCanvas":false,"props":{"size":"small","variant":"contained","color":"primary","text":"Learn more"},"displayName":"Button","custom":{},"parent":"DTHVBlj8u8","hidden":false,"nodes":[],"linkedNodes":{}}}`;

const defaultFrameChildren = (
  <Element is={Container} padding={5} background="#eee" canvas>
    <Card />
    <Button size="small" variant="outlined">Click</Button>
    <Text size="small" text="Hi world!" />
    <Element is={Container} padding={2} background="#999" canvas>
      <Text size="small" text="It's me again!" />
    </Element>
  </Element>
);

const FrameContent = () => {
  const { enabled } = useEditor(state => ({ enabled: state.options.enabled }));
  return (
    <Frame data={(enabled && jsonData) ? jsonData : null}>{/* if data is set, it override the children */}
      {/*
      manually render json to fix Craft.js bug when editor is disabled.
      if data prop is set, the editor is always enabled,
      regardless of the true enabled state
      Reference: https://github.com/prevwong/craft.js/issues/395
      */}
      {jsonData ? renderPreloadedJson(jsonData) : defaultFrameChildren}
    </Frame>
  );
}

export default function App() {
  const [ editMode, setEditMode ] = useState(false);
  const [ editorKey, setEditorKey ] = useState(new Date().getTime());
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditorKey(new Date().getTime());
  }
  return (
    <div style={{margin: "0 auto", width: "800px"}}>
      <Typography variant="h5" align="center">A super simple page editor</Typography>
      <button onClick={toggleEditMode}>toggle edit mode: current {JSON.stringify(editMode)}</button>
      {/* refresh Editor instance using key to fix bug of Craft.js. Reference: https://github.com/prevwong/craft.js/issues/395 */}
      <Editor key={editorKey} resolver={editorResolver} enabled={editMode}>
        <Topbar />
        <Grid container spacing={3} style={{paddingTop: "10px"}}>
          <Grid item xs>
            <FrameContent/>
          </Grid>
          <Grid item xs={3}>
            <Paper>
              <Toolbox />
              <SettingsPanel />
            </Paper>          
          </Grid>
        </Grid>
      </Editor>
    </div>
  );
}