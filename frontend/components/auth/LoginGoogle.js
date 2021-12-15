import React from 'react';
import GoogleLogin from 'react-google-login';
import { GOOGLE_CLIENT_ID } from '../../config';
import { loginWithGoogle, authenticate, isAuth } from '../../actions/auth';
import { useRouter } from 'next/router';

export default function LoginGoogle() {
  const router = useRouter();
  const responseGoogle = (response) => {
    const { tokenId } = response;
    loginWithGoogle({ tokenId }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        authenticate(data, () => {
          if (isAuth() && isAuth().role === 1) {
            router.push('/admin');
          } else {
            router.push('/user');
          }
        });
      }
    });
  };
  return (
    <div className="pb-3">
      <GoogleLogin
        clientId={`${GOOGLE_CLIENT_ID}`}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
      />
    </div>
  );
}
