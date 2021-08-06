import React, { Fragment } from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import TourOverview from './TourOverview';
import Spinner from '../../utils/Spinner';
import classes from './Tour.module.css';
import api from '../../config/api';
import apiConfig from '../../config/apiConfig';

const Tours = () => {
  const history = useHistory();
  const routeToDetail = (slug, id) =>
    history.push({ pathname: `/tour-detail/${slug}`, data: id });

  const fetchTours = async () => {
    const { data } = await api.get(apiConfig.tours, {
      handlerEnabled: true,
    });
    return data.data.document;
  };
  const { data, isLoading } = useQuery('tours', fetchTours);

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <Fragment>
      <main className={classes.main}>
        <div className={classes.card_container}>
          {data &&
            data.map((tourObj) => (
              <TourOverview
                key={tourObj.id}
                tour={tourObj}
                routeToDetail={routeToDetail}
              />
            ))}
        </div>
      </main>
    </Fragment>
  );
};

export default Tours;
