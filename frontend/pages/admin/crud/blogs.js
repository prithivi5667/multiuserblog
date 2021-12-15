import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import BlogRead from '../../../components/crud/BlogRead';

const Blogs = () => (
  <Layout>
    <Admin>
      <div className="container">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2 className="font-weight-bold">Manage blogs</h2>
          </div>
          <div className="col-md-12">
            <BlogRead />
          </div>
        </div>
      </div>
    </Admin>
  </Layout>
);
export default Blogs;
