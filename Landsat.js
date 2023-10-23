

var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterDate('2019-11-17', '2020-03-31')
    .filterBounds(geometry);

// Applies scaling factors.
function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBands, null, true);
}

dataset = dataset.map(applyScaleFactors);

var visualization = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3,
};


Map.addLayer(dataset, visualization, 'True Color (432)');


Export.image.toDrive({ 
  image: dataset,
  description: 'Landsat8_for_NDBI',
  scale: 30, 
  maxPixels: 1e9, 
  region: geometry 
}); 
