import PropTypes from 'prop-types';
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';
import classes from '../pages/tourdetail/TourDetail.module.css';
import '../App.css';

mapboxgl.accessToken =
  'pk.eyJ1IjoidmF6YW50aCIsImEiOiJja292NHpkNTEwNTU4MnBrNTh0YXFxaW53In0.Jk8BKtWoPSZGduLEODqe6A';

const MapBox = ({ tour }) => {
  const mapContainerRef = useRef(null);

  // initialize map when component mounts
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      // See style options here: https://docs.mapbox.com/api/maps/#styles
      style: 'mapbox://styles/vazanth/ckov5mgra0d3118lhb00y9y7a',
      scrollZoom: false,
      flyTo: false,
      // center: [-118.113491, 34.111745],
      // zoom: 10,
      // interactive: false,
    });

    // add navigation control (the +/- zoom buttons)
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

    const bounds = new mapboxgl.LngLatBounds();

    tour.locations.forEach((loc) => {
      // Create marker
      const el = document.createElement('div');
      el.className = 'marker';

      // Add marker
      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(loc.coordinates)
        .addTo(map);

      // Add popup
      new mapboxgl.Popup({
        offset: 30,
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

      // Extend map bounds to include current location
      bounds.extend(loc.coordinates);
    });

    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });
    // clean up on unmount
    return () => map.remove();
  }, []);

  return (
    <section className={classes.section__map}>
      <div className="map-container" ref={mapContainerRef} />
    </section>
  );
};

MapBox.propTypes = {
  tour: PropTypes.shape({
    locations: PropTypes.shape({
      forEach: PropTypes.func,
    }),
  }),
};

MapBox.defaultProps = {
  tour: {
    locations: [],
  },
};

export default MapBox;
