const fs = require("fs");
const path = require("path");
const tinycolor = require("tinycolor2");

const fieldName = "code";
const sourceFile = "landskap.sld";

const name = path.parse(sourceFile).name;

const template = JSON.parse(fs.readFileSync("template.lyrx.json"));
const srcLayers = JSON.parse(fs.readFileSync("la_farger.json"));

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
const templateClass = group.classes[0];
group.classes = [];

Object.keys(srcLayers).forEach(name => {
  const color = srcLayers[name].farge;
  name = name.replace("NN-", "");
  const newClass = JSON.parse(JSON.stringify(templateClass));
  newClass.label = name;
  newClass.values[0].fieldValues = [name];
  newClass.symbol.symbol.symbolLayers.forEach(sm => {
    switch (sm.type) {
      case "CIMSolidStroke":
        sm.color.values = toEsriColor(strokeColor(color));
        break;
      case "CIMSolidFill":
        sm.color.values = toEsriColor(color);
        break;
    }
  });
  group.classes.push(newClass);
});

console.log(JSON.stringify(template));

function strokeColor(color) {
  return new tinycolor(color).darken(40);
}

function toEsriColor(color) {
  const tc = new tinycolor(color);
  return [Math.round(tc._r), Math.round(tc._g), Math.round(tc._b), 100];
}
