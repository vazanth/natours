/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import classes from './TourDetail.module.css';

const TourPlaces = ({ tour }) => (
  <Fragment>
    <section className={classes.section__pictures}>
      {tour.images.map((img, index) => (
        <div className={classes.picture__box} key={img}>
          <img
            alt="The Park Camper Tour 1"
            className={
              index === 0
                ? `${classes.picture__box__img} ${classes.picture__box__img__1}`
                : index === 1
                ? `${classes.picture__box__img} ${classes.picture__box__img__2}`
                : `${classes.picture__box__img} ${classes.picture__box__img__3}`
            }
            src={`${process.env.PUBLIC_URL}/tours/${img}`}
          />
        </div>
      ))}
    </section>
  </Fragment>
);

TourPlaces.propTypes = {
  tour: PropTypes.shape({
    images: PropTypes.shape({
      map: PropTypes.func,
    }),
  }),
};

TourPlaces.defaultProps = {
  tour: {
    images: [],
  },
};

export default TourPlaces;
