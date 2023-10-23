var dataset = ee.ImageCollection('LANDSAT/LC08/C02/T1_TOA')
    .filterDate('2022-12-01', '2023-05-31')
    .filterMetadata('CLOUD_COVER', "less_than", 2);

var mosaic = dataset.median().select(['B7', 'B5', 'B4','B3', 'B2', 'B1']).clip(boundary);

var trueColor321 = mosaic.select(['B3', 'B2', 'B1']);
var trueColor321Vis = {
  min: 0.0,
  max: 0.4,
  gamma: 1.2,
};
Map.centerObject(boundary);
Map.addLayer(trueColor321, trueColor321Vis, 'True Color (321)');

var training = mosaic.sample({
  region: boundary,
  scale: 30,
  numPixels: 5000
});

var kmeans = ee.Clusterer.wekaKMeans(5).train(training);
var kmeansresult = mosaic.cluster(kmeans);

var palette = ['gray', 'black', 'green', 'blue', 'purple', ];
var cluster_vis = {
  'min': 0,
  'max': 4,
  'palette': palette};

Map.addLayer(kmeansresult, cluster_vis, 'kmeans');

Export.image.toDrive({ 
  image: mosaic,
  description: 'Landsat7 for lulc',
  scale: 30, 
  maxPixels: 1e13, 
  region: boundary 
});