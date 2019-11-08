const { io, json, log } = require("lastejobb");

const r = {};

const src = io.lesDatafil("myr.geojson");
src.features.forEach(feature => {
  src.name = "polygons";
  const props = feature.properties;
  delete props.rowNumber;
  delete props.locality;
  delete props.kommnr;
  delete props.areal_m2;
  json.moveKey(props, "myr_id", "autorkode");
  json.moveKey(props, "myr struktur", "myrmassivstruktur");

  for (var key of Object.keys(props)) {
    r[key] = r[key] || {};
    const values = props[key].split("|");
    for (var value of values) {
      const values2 = value.split("/");
      for (var value2 of values2) {
        r[key][value2] = (r[key][value2] || 0) + 1;
      }
    }
  }
  fremstad(r, props.Fremstad, props.Naturtype);
  props.koder = [
    ...mapNaturtype(props.Naturtype),
    ...mapLandform(props.Tormarksform)
  ];
  r["koder"] = r["koder"] || {};
  for (var value2 of props.koder)
    r["koder"][value2] = (r["koder"][value2] || 0) + 1;
});

function fremstad(r, fremstad, na) {
  r["fr2na"] = r["fr2na"] || {};
  r = r.fr2na;
  na = na.split("|");
  fremstad.split("|").forEach(fr => {
    r[fr] = r[fr] || {};
    const rfr = r[fr];
    na.forEach(n => (rfr[n] = (rfr[n] || 0) + 1));
  });
}

function mapNaturtype(na) {
  const r = [];
  na.replace(/\//g, "|")
    .split("|")
    .forEach(t => {
      if (t !== "-" && t.length > 0) r.push("NN-NA-TI-" + t);
    });
  return new Set(r);
}

function mapLandform(tf) {
  const r = [];
  tf.replace(/\//g, "|")
    .split("|")
    .forEach(t => {
      t = t.replace("3TO-", "");
      if (t === "XX" || t === "-" || t === "0" || t.length <= 0)
        return "NN-NA-BS-3TO";
      r.push("NN-NA-BS-3TO-" + t);
    });
  return new Set(r);
}

io.skrivDatafil("stats", r);
io.skrivDatafil("myr_4326.geojson", src);
