import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { useUserState } from '../../context/UserContext';
import classes from './TourDetail.module.css';
import '../../App.css';
import logowhite from '../../assets/img/logo-white.png';

const TourFooter = ({ tour }) => {
  const { userName } = useUserState();
  return (
    <Fragment>
      <section className={classes.section__cta}>
        <div className={classes.cta}>
          <div className={`${classes.cta__img} ${classes.cta__img__logo}`}>
            <img alt="Natours logo" src={logowhite} />
          </div>
          <img
            alt=""
            className={`${classes.cta__img} ${classes.cta__img__1}`}
            src={`${process.env.PUBLIC_URL}/tours/${tour.images[0]}`}
          />
          <img
            alt=""
            className={`${classes.cta__img} ${classes.cta__img__2}`}
            src={`${process.env.PUBLIC_URL}/tours/${tour.images[1]}`}
          />
          <div className={classes.cta__content}>
            <h2 className={classes.heading__secondary}>
              What are you waiting for?
            </h2>
            <p className={classes.cta__text}>
              {`${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`}
            </p>
            <button className="btn btn--green span-all-rows" type="button">
              {userName ? `Book tour now !` : `Login to book tour`}
            </button>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

TourFooter.propTypes = {
  tour: PropTypes.shape({
    duration: PropTypes.number,
    images: PropTypes.string,
  }),
};

TourFooter.defaultProps = {
  tour: {
    duration: 0,
    images: '',
  },
};

export default TourFooter;
