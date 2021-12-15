import Layout from '../components/Layout';
import SigninComponent from '../components/auth/SigninComponent';
import { useRouter } from 'next/router';

const Signin = () => {
  const router = useRouter();
  const showRedirectMessage = () =>
    router.query.message ? <div className="alert alert-danger">{router.query.message}</div> : '';
  return (
    <Layout>
      <h2 className="text-center pt-4 pb-4">Signin</h2>
      <div className="row">
        <div className="col-md-6 offset-md-3">{showRedirectMessage()}</div>
      </div>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <SigninComponent />
        </div>
      </div>
    </Layout>
  );
};
export default Signin;
