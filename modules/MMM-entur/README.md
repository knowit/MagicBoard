#MMM-entur

##Instructions
* Requires Python 3.7. Install packages:
    * pip install geopy
    
##Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
All config values are default and only needs to be added if changed.
{
    module: 'MMM-entur',
    config: {
        position: [0, 0],
        max_distance: 500,
        zoom: 16,
        mapboxAccessToken: "",
        citybikeUpdateInterval: 1000 * 60,
        publicTransportUpdateInterval: 1000 * 60,
        publicTransportLineRotationSpeed: 20
    }
}
```