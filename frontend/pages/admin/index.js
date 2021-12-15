import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import Link from 'next/link';
const AdminIndex = () => (
  <Layout>
    <Admin>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Admin Dashboard</h2>
          </div>
          <div className="col-md-12">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/admin/crud/category-tag">
                  <a>Create category</a>
                </Link>
              </li>
              <li className="list-group-item">
                <Link href="/admin/crud/category-tag">
                  <a>Create Tag</a>
                </Link>
              </li>
              <li className="list-group-item">
                <Link href="/admin/crud/blog">
                  <a>Create Blog</a>
                </Link>
              </li>
              <li className="list-group-item">
                <Link href="/admin/crud/blogs">
                  <a>Update/Delete Blogs</a>
                </Link>
              </li>
              <li className="list-group-item">
                <Link href="/user/update">
                  <a>Update Profile</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Admin>
  </Layout>
);
export default AdminIndex;