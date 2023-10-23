var L7_collection = ee.ImageCollection("LANDSAT/LE07/C02/T1_TOA")
    .filterDate('2013-01-01', '2018-12-31')
    .filterMetadata('CLOUD_COVER', "less_than", 1)
    .filterBounds(geometry);

var L7_3bands = ['B3', 'B2', 'B1'];
var L7_3mosaic = L7_collection.median().select(L7_3bands).clip(geometry);
var trueColor321Vis = { 
  min: 0.0,
  max: 0.4,
  gamma: 1.2,
};

var L7_bands = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6_VCID_1', 'B6_VCID_2', 'B7', 'B8'];
var L7_mosaic = L7_collection.median().select(L7_bands).clip(geometry);
Map.addLayer(L7_3mosaic, trueColor321Vis, 'True Color (321)');


var L7_mosaic = L7_collection.median().select(L7_bands).clip(geometry);
print(L7_mosaic);

Export.image.toDrive({ 
  image: L7_mosaic,
  description: 'Landsat7 for lulc',
  scale: 30, 
  maxPixels: 1e13, 
  region: geometry 
});