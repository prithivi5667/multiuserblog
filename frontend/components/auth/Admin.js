import React, { useEffect } from 'react';
import { isAuth } from '../../actions/auth';
import Router from 'next/router';

export default function Admin({ children }) {
  useEffect(() => {
    if (!isAuth()) {
      Router.push(`/signin`);
    } else if (isAuth().role !== 1) {
      Router.push('/');
    }
  }, []);
  return <>{children}</>;
}
