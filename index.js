const fs = require("fs");
const path = require("path");
const tinycolor = require("tinycolor2");

const fieldName = "code";
const sourceFile = "Landskap.sld";
const strokeColor = "#4af";

const name = path.parse(sourceFile).name;

const template = JSON.parse(fs.readFileSync("template.lyrx.json"));

template.uRI = `CIMPATH=map/${name}.xml`;
const layerDef = template.layerDefinitions[0];

layerDef.name = name;
layerDef.description = name;
layerDef.uRI = template.uRI;

const featureTable = layerDef.featureTable;
const dataConnection = featureTable.dataConnection;
dataConnection.dataset = name;
dataConnection.workspaceConnectionString = `DATABASE=.\\${name}.gdb`;

template.layers[0] = `CIMPATH=map/${name}.xml`;

const { renderer } = layerDef;
renderer.fields = [fieldName];
const { groups } = renderer;
const group = groups[0];
const class0 = group.classes[0];

class0.label = "LA-I-D";
class0.values[0].fieldValues = "LA-I-D";
class0.symbol.symbol.symbolLayers.forEach(sm => {
  switch (sm.type) {
    case "CIMSolidStroke":
      sm.color.values = toEsriColor(strokeColor);
      break;
    case "CIMSolidFill":
      sm.color.values = toEsriColor("#ff00ff");
      break;
  }
});
console.log(JSON.stringify(template));

function toEsriColor(color) {
  const tc = new tinycolor(color);
  return [tc._r, tc._g, tc._b, 100];
}
