import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getCookie, isAuth } from '../../actions/auth';
import { list, removeBlog } from '../../actions/blog';
import moment from 'moment';

export default function BlogRead({ username }) {
  const [blogs, setBlogs] = useState([]);
  const [message, setMessage] = useState('');
  const token = getCookie('token');

  const loadBlogs = () => {
    list(username).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setBlogs(data);
      }
    });
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const deleteBlog = (slug) => {
    removeBlog(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setMessage(data.message);
        loadBlogs();
      }
    });
  };

  const deleteConfirm = (slug) => {
    const answer = window.confirm('Are you sure want to delete your blog');
    if (answer) {
      deleteBlog(slug);
    }
  };
  const showUpdateButton = (blog) => {
    if (isAuth() && isAuth().role === 0) {
      return (
        <Link href={`/user/crud/${blog.slug}`}>
          <a className="btn btn-sm btn-warning">Update</a>
        </Link>
      );
    } else if (isAuth() && isAuth().role === 1) {
      return (
        <Link href={`/admin/crud/${blog.slug}`}>
          <a className="ml-2 btn btn-sm btn-warning">Update</a>
        </Link>
      );
    }
  };
  const showAllBlogs = () =>
    blogs.map((blog, i) => (
      <div key={i} className="pb-5">
        <h3>{blog.title}</h3>
        <p className="mark">
          Written by {blog.postedBy.username} | Published on {moment(blog.updatedAt).fromNow()}
        </p>
        <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>
          Delete
        </button>
        {showUpdateButton(blog)}
      </div>
    ));
  return (
    <>
      <div className="row">
        <div className="col-md-12 pt-5 pb-5">
          {message && <div className="alert alert-warning">{message}</div>}
          {showAllBlogs()}
        </div>
      </div>
    </>
  );
}
