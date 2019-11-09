const { io, json } = require("lastejobb");

const statistics = {};

const arraysInDisguise = [
  "Tormarksform",
  "versjoner",
  "Fremstad",
  "Vannlig veg",
  "Sjelden veg",
  "myr struktur",
  "Naturtype"
];
const src = io.lesDatafil("myr.geojson");
src.features.forEach(feature => {
  src.name = "polygons";
  const props = feature.properties;
  addStatistics(props);
  for (var arraykey of arraysInDisguise) toArray(props, arraykey);
  delete props.rowNumber;
  delete props.locality;
  delete props.kommnr;
  delete props.areal_m2;
  json.moveKey(props, "Fremstad", "fremstad");
  json.moveKey(props, "myr_id", "autorkode");
  json.moveKey(props, "myr struktur", "myrmassivstruktur");
  json.moveKey(props, "Vannlig veg", "vegetasjon.vanlig");
  json.moveKey(props, "Sjelden veg", "vegetasjon.sjelden");

  props.koder = [
    ...mapNaturtype(props.Naturtype),
    ...mapLandform(props.Tormarksform)
  ];
  delete props.Naturtype;
  delete props.Tormarksform;
});

io.skrivBuildfil("myr.4326.geojson", src);
io.skrivDatafil("stats", statistics);

function mapNaturtype(na) {
  const r = [];
  (na || []).forEach(t => {
    if (t === "-" || t.length <= 0) return;
    t = t.replace("L4-C", "L4");
    r.push("NN-NA-TI-" + t);
  });
  return new Set(r);
}

function mapLandform(tf) {
  const r = [];
  (tf || []).forEach(t => {
    t = t.replace("3TO-", "");
    if (t === "XX" || t === "-" || t === "0" || t.length <= 0)
      return "NN-NA-BS-3TO";
    r.push("NN-NA-BS-3TO-" + t);
  });
  return new Set(r);
}

function addStatistics(props) {
  for (var key of Object.keys(props)) {
    statistics[key] = statistics[key] || {};
    const values = Array.isArray(props[key])
      ? props[key]
      : props[key].split("|");
    for (var value of values) {
      const values2 = value.split("/");
      for (var value2 of values2) {
        statistics[key][value2] = (statistics[key][value2] || 0) + 1;
      }
    }
  }
}

function toArray(props, key) {
  if (!props[key]) return [];
  const arr = props[key].replace("/", "|").split("|");
  props[key] = [...new Set(arr)];
}
