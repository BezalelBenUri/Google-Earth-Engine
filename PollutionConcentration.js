var collection = ee.ImageCollection('COPERNICUS/S5P/OFFL/L3_CH4')
  .select('CH4_column_volume_mixing_ratio_dry_air')
  .filterBounds(geometry)
  .filterDate('2019-11-17', '2020-03-31')
  .mean()
  
var clip = collection.clip(geometry);

var band_vis = {
  min: 1750,
  max: 1900,
  palette : ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};

var mean = clip.reduce(ee.Reducer.mean());

Map.addLayer(mean, band_vis, 'S5P CH4');

Export.image.toDrive({ 
  image: mean,
  description: 'Sentinel_2_B2_B3_B8',
  scale: 10, 
  maxPixels: 1e13, 
  region: geometry 
});