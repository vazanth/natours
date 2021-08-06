import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import classes from './TourDetail.module.css';

import icons from '../../assets/img/icons.svg';

const TourReviews = ({ tour }) => (
  <Fragment>
    <section className={classes.section__reviews}>
      <div className={classes.reviews}>
        {tour.reviews.map((review) => (
          <div className={classes.reviews__card} key={review._id}>
            <div className={classes.reviews__avatar}>
              <img
                alt={review.user.name}
                className={classes.reviews__avatar__img}
                src={`${process.env.PUBLIC_URL}/users/${review.user.photo}`}
              />
              <h6 className={classes.reviews__user}>{review.user.name}</h6>
            </div>
            <p className={classes.reviews__text}>{review.review}</p>
            <div className={classes.reviews__rating}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <svg
                  key={Math.random()}
                  className={
                    review.rating >= index + 1
                      ? `${classes.reviews__star}  ${classes.reviews__star__active}`
                      : `${classes.reviews__star}  ${classes.reviews__star__inactive}`
                  }
                >
                  <use xlinkHref={`${icons}#icon-star`} />
                </svg>
              ))}
              {/* <svg
                className={`${classes.reviews__star} ${classes.reviews__star__active}`}
              >
                <use xlinkHref={`${icons}#icon-star`} />
              </svg>
              <svg
                className={`${classes.reviews__star} ${classes.reviews__star__active}`}
              >
                <use xlinkHref={`${icons}#icon-star`} />
              </svg>
              <svg
                className={`${classes.reviews__star} ${classes.reviews__star__active}`}
              >
                <use xlinkHref={`${icons}#icon-star`} />
              </svg>
              <svg
                className={`${classes.reviews__star} ${classes.reviews__star__active}`}
              >
                <use xlinkHref={`${icons}#icon-star`} />
              </svg> */}
            </div>
          </div>
        ))}
      </div>
    </section>
  </Fragment>
);

TourReviews.propTypes = {
  tour: PropTypes.shape({
    reviews: PropTypes.shape({
      map: PropTypes.func,
    }),
  }),
};

TourReviews.defaultProps = {
  tour: {
    reviews: [],
  },
};

export default TourReviews;
