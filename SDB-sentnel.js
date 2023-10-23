

var S2_collection = ee.ImageCollection("COPERNICUS/S2")
  .filterBounds(geometry)
  .filterDate('2021-12-01', '2021-12-31')
  .filter(ee.Filter.lte('CLOUDY_PIXEL_PERCENTAGE', 0));
  
Map.centerObject(geometry);

print(S2_collection);

var S2_bands = ['B1', 'B2', 'B3','B4', 'B5','B6', 'B7', 'B8','B9', 'B10', 'B11', 'B12'];


var S2_mosaic = S2_collection.median().select(S2_bands).clip(geometry);

var S2_display = {bands: ['B4', 'B3', 'B2'], min: 0.0, max: 0.3};

Map.addLayer(S2_mosaic, S2_display, "Sentinel-2");
 
 

Export.image.toDrive({ 
  image: S2_mosaic,
  description: '2016',
  scale: 10, 
  maxPixels: 1e13, 
  region: geometry 
});


