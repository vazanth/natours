import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import classes from './TourDetail.module.css';
import '../../App.css';

import icons from '../../assets/img/icons.svg';

const TourInfo = ({ tour }) => {
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
      <section className={classes.section__header}>
        <div className={classes.header__hero}>
          <div className={classes.header__hero__overlay}>&nbsp;</div>
          <img
            alt="Tour 5"
            className={classes.header__hero__img}
            src={`${process.env.PUBLIC_URL}/tours/${tour.imageCover}`}
          />
        </div>
        <div className={classes.heading__box}>
          <h1 className={classes.heading__primary}>
            <span>{tour.name}</span>
          </h1>
          <div className={classes.heading__box__group}>
            <div className={classes.heading__box__detail}>
              <svg className={classes.heading__box__icon}>
                <use xlinkHref={`${icons}#icon-clock`} />
              </svg>
              <span
                className={classes.heading__box__text}
              >{`${tour.duration} days`}</span>
            </div>
            <div className={classes.heading__box__detail}>
              <svg className={classes.heading__box__icon}>
                <use xlinkHref={`${icons}#icon-map-pin`} />
              </svg>
              <span className={classes.heading__box__text}>
                {tour.startLocation.description}
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className={classes.section__description}>
        <div className={classes.overview__box}>
          <div>
            <div className={classes.overview__box__group}>
              <h2 className={`${classes.heading__secondary} ma-bt-lg`}>
                Quick facts
              </h2>
              <div className={classes.overview__box__detail}>
                <svg className={classes.overview__box__icon}>
                  <use xlinkHref={`${icons}#icon-calendar`} />
                </svg>
                <span className={classes.overview__box__label}>Next date</span>
                <span className={classes.overview__box__text}>
                  {formatDate(tour.startDates[0])}
                </span>
              </div>
              <div className={classes.overview__box__detail}>
                <svg className={classes.overview__box__icon}>
                  <use xlinkHref={`${icons}#icon-trending-up`} />
                </svg>
                <span className={classes.overview__box__label}>Difficulty</span>
                <span className={classes.overview__box__text}>
                  {tour.difficulty}
                </span>
              </div>
              <div className={classes.overview__box__detail}>
                <svg className={classes.overview__box__icon}>
                  <use xlinkHref={`${icons}#icon-user`} />
                </svg>
                <span className={classes.overview__box__label}>
                  Participants
                </span>
                <span
                  className={classes.overview__box__text}
                >{`${tour.maxGroupSize} People`}</span>
              </div>
              <div className={classes.overview__box__detail}>
                <svg className={classes.overview__box__icon}>
                  <use xlinkHref={`${icons}#icon-star`} />
                </svg>
                <span className={classes.overview__box__label}>Rating</span>
                <span
                  className={classes.overview__box__text}
                >{`${tour.ratingsAverage} / 5`}</span>
              </div>
            </div>
            <div className={classes.overview__box__group}>
              <h2 className={`${classes.heading__secondary} ma-bt-lg`}>
                Your tour guides
              </h2>
              {tour.guides.map((guide) => (
                <div className={classes.overview__box__detail} key={guide._id}>
                  <img
                    alt={guide.role}
                    className={classes.overview__box__img}
                    src={`${process.env.PUBLIC_URL}/users/${guide.photo}`}
                  />
                  <span className={classes.overview__box__label}>
                    {guide.role.replace('-', ' ')}
                  </span>
                  <span className={classes.overview__box__text}>
                    {guide.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className={classes.description__box}>
          <h2 className={`${classes.heading__secondary} ma-bt-lg`}>
            {tour.summary}
          </h2>
          <p className={classes.description__text}>{tour.description}</p>
        </div>
      </section>
    </Fragment>
  );
};

TourInfo.propTypes = {
  tour: PropTypes.shape({
    description: PropTypes.string,
    difficulty: PropTypes.string,
    duration: PropTypes.number,
    guides: PropTypes.shape({
      map: PropTypes.func,
    }),
    imageCover: PropTypes.string,
    maxGroupSize: PropTypes.number,
    name: PropTypes.string,
    ratingsAverage: PropTypes.number,
    startDates: PropTypes.string,
    startLocation: PropTypes.shape({
      description: PropTypes.string,
    }),
    summary: PropTypes.string,
  }),
};

TourInfo.defaultProps = {
  tour: {},
};

export default TourInfo;
