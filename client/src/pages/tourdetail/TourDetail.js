import PropTypes from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { useQuery } from 'react-query';
import TourInfo from './TourInfo';
import TourPlaces from './TourPlaces';
import TourReviews from './TourReviews';
import TourFooter from './TourFooter';
import MapBox from '../../components/MapBox';
import Spinner from '../../utils/Spinner';
import api from '../../config/api';
import apiConfig from '../../config/apiConfig';

const TourDetail = ({ location }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchTourDetail = async () => {
    const { data } = await api.get(`${apiConfig.tours}/${location.data}`, {
      handlerEnabled: true,
    });
    return data.data.document;
  };

  const { data, isLoading } = useQuery('tourdetail', fetchTourDetail);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Fragment>
      <TourInfo tour={data} />
      <TourPlaces tour={data} />
      <MapBox tour={data} />
      <TourReviews tour={data} />
      <TourFooter tour={data} />
    </Fragment>
  );
};

TourDetail.propTypes = {
  location: PropTypes.shape({
    data: PropTypes.string,
  }),
};

TourDetail.defaultProps = {
  location: {
    data: '',
  },
};

export default TourDetail;
