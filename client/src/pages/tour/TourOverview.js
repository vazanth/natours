import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classes from './Tour.module.css';
import '../../App.css';
import icons from '../../assets/img/icons.svg';

const TourOverview = ({ tour, routeToDetail }) => {
  const formatDate = (tourDate) => {
    const date = new Date(tourDate);
    const monthName = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format;
    return monthName(date);
  };

  return (
    <Fragment>
      <div className={classes.card}>
        <div className={classes.card__header}>
          <div className={classes.card__picture}>
            <div className={classes.card__picture__overlay}>&nbsp;</div>
            <img
              src={`${process.env.PUBLIC_URL}/tours/${tour.imageCover}`}
              alt={tour.name}
              className={classes.card__picture__img}
            />
          </div>
          <h3 className={classes.heading_tertirary}>
            <span>{tour.name}</span>
          </h3>
        </div>
        <div className={classes.card__details}>
          <h4
            className={classes.card__sub__heading}
          >{`${tour.difficulty} ${tour.duration}-day tour`}</h4>
          <p className={classes.card__text}>{tour.summary}</p>
          <div className={classes.card__data}>
            <svg className={classes.card__icon}>
              <use xlinkHref={`${icons}#icon-map-pin`} />
            </svg>
            <span>{tour.startLocation.description}</span>
          </div>
          <div className={classes.card__data}>
            <svg className={classes.card__icon}>
              <use xlinkHref={`${icons}#icon-calendar`} />
            </svg>
            <span>{formatDate(tour.startDates[0])}</span>
          </div>
          <div className={classes.card__data}>
            <svg className={classes.card__icon}>
              <use xlinkHref={`${icons}#icon-flag`} />
            </svg>
            <span>{`${tour.locations.length} stops`}</span>
          </div>
          <div className={classes.card__data}>
            <svg className={classes.card__icon}>
              <use xlinkHref={`${icons}#icon-user`} />
            </svg>
            <span>{`${tour.maxGroupSize} people`}</span>
          </div>
        </div>
        <div className={classes.card__footer}>
          <p>
            <span
              className={classes.card__footer_value}
            >{`$${tour.price}`}</span>
            <span className={classes.card__footer_text}>per preson</span>
          </p>
          <p className={classes.card__ratings}>
            <span className={classes.card__footer_value}>
              {tour.ratingsAverage}
            </span>
            <span
              className={classes.card__footer_text}
            >{`rating (${tour.ratingsQuantity})`}</span>
          </p>
          <button
            type="button"
            onClick={() => routeToDetail(tour.slug, tour.id)}
            className={`${classes.btn} btn btn__green btn__small`}
          >
            Details
          </button>
        </div>
      </div>
    </Fragment>
  );
};

TourOverview.propTypes = {
  routeToDetail: PropTypes.func,
  tour: PropTypes.shape({
    id: PropTypes.string,
    difficulty: PropTypes.string,
    duration: PropTypes.number,
    imageCover: PropTypes.string,
    locations: PropTypes.shape({
      length: PropTypes.number,
    }),
    maxGroupSize: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    ratingsAverage: PropTypes.string,
    ratingsQuantity: PropTypes.string,
    startDates: PropTypes.string,
    startLocation: PropTypes.shape({
      description: PropTypes.string,
    }),
    summary: PropTypes.string,
    slug: PropTypes.string,
  }),
};

TourOverview.defaultProps = {
  tour: [],
  routeToDetail: function () {},
};

export default TourOverview;
