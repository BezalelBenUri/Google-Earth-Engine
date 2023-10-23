
var dataset = ee.ImageCollection('COPERNICUS/S2_HARMONIZED')
                  .filterBounds(geometry)
                  .filterDate('2022-1-01', '2022-07-01')
                  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 0))
                  .select('B.*');

var image = dataset.median().clip(geometry);

//AWESOME SPECTRAL INDICES LIBRARY
var spectral = require("users/dmlmont/spectral:spectral");

//COMPUTE SPECTRAL INDICES
var spectral_indices = spectral.computeIndex(image,["NDVI","BI",'NDWI','EMBI'],
  {"N":image.select('B8'),
    "R":image.select('B4'),
    "G":image.select('B3'),
    "B":image.select('B2'),
    "S1":image.select('B11'),
    "S2":image.select("B12")
  });

Map.addLayer(spectral_indices.select('NDVI'), {min:0, max:1,palette: ['white', 'green']}, 'NDVI');
Map.addLayer(spectral_indices.select('BI'), {min:0, max:1,palette: ['white', 'brown']}, 'BI');
Map.addLayer(spectral_indices.select('NDWI'), {min:0, max:1,palette: ['white', 'cyan']}, 'NDWI');
Map.addLayer(spectral_indices.select('EMBI'), {min:0, max:1,palette: ['white', 'red']}, 'EMBI');
Map.centerObject(geometry);

Export.image.toDrive({ 
  image: spectral_indices.select('NDVI'),
  description: 'NDVI',
  scale: 10, 
  maxPixels: 1e13, 
  region: geometry 
});