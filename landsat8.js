

var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
      .filterBounds(geometry)
      .filterDate('2019-11-17', '2020-03-31')
//      .filter('CLOUDY_PIXEL_PERCENTAGE < 200');
//      .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 100));

// Applies scaling factors.
function applyScaleFactors(image) {
  var qaMask = image.select('QA_PIXEL').bitwiseAnd(parseInt('11111', 2)).eq(0);
  var saturationMask = image.select('QA_RADSAT').eq(0);
  
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBands = image.select('ST_B.*').multiply(0.00341802).add(149.0);
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBands, null, true)
              .updateMask(qaMask)
              .updateMask(saturationMask);
}

dataset = dataset.map(applyScaleFactors);

var bands =  ['SR_B7', 'SR_B5', 'SR_B2']

var mosaic = dataset.median().select(bands).clip(geometry);

var display = {bands: bands, min: 0.0, max: 0.3};

Map.addLayer(mosaic, display, "Landsat8");


Export.image.toDrive({ 
  image: mosaic,
  description: 'Landsat8_SR_7_5_2',
  scale: 30, 
  maxPixels: 1e13, 
  region: geometry 
}); 
