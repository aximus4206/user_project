import React, { useEffect, useState } from 'react';
import styles from './UserTable.module.scss';
import { fetchUsersRequest } from '../../redux/users/usersActions';

import { useSearchParams } from 'react-router-dom';
import { getUsers } from '../../redux/users/usersSelectors';
import { useDispatch, useSelector } from 'react-redux';
import User from './UserItem/UserTableItem';

const UserTable = () => {
  const users = useSelector(getUsers);

  const dispatch = useDispatch();
  
  const [fetching, setFetching] = useState(false);
  
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  useEffect(() => {
    if (fetching) {
      let page = Number(searchParams.get('page'));
      page += 1;
      dispatch(fetchUsersRequest({ page, results: 10 }));
      setSearchParams(`page=${page}`);
      setFetching(false);
    }
  }, [fetching, dispatch, setSearchParams, searchParams ]);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);
    return function () {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const scrollHandler = (event: Event) => {
    const target = (event.target as Document).documentElement;
    if (target.scrollHeight - (target.scrollTop + window.innerHeight) < 100) {
      setFetching(true);
    }
  };

  return (
    <div className={styles.user_table}>
      {users.map(user => (
        <User key={user.login.uuid} user={user} />
      ))}
    </div>
  );
};

export default UserTable;
