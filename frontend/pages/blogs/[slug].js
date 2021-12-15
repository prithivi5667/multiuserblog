import { API, APP_NAME, DOMAIN, FB_APP_ID } from '../../config';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { singleBlog, listRelated } from '../../actions/blog';
import SmallCard from '../../components/blog/SmallCard';
import moment from 'moment';
import renderHTML from 'react-render-html';
import DisqusThread from '../../components/DisqusTread';

export default function SingleBlog({ blog, query }) {
  const [related, setRelated] = useState([]);

  const loadRelated = () => {
    listRelated({ blog }).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setRelated(data);
      }
    });
  };
  useEffect(() => {
    loadRelated();
  }, []);

  const head = () => (
    <Head>
      <title>
        {blog.title} | {APP_NAME}
      </title>
      <meta name="description" content={blog.mdesc} />
      <link rel="canonical" href={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
      <meta property="og:description" content={blog.mdesc} />
      <meta property="og:type" content="webiste" />
      <meta property="og:url" content={`${DOMAIN}/blogs/${query.slug}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />

      <meta property="og:image" content={`${API}/blog/photo/${blog.slug}`} />
      <meta property="og:image:secure_url" content={`${API}/blog/photo/${blog.slug}`} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID}`} />
    </Head>
  );

  const showBlogCategories = (blog) =>
    blog.categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a className="btn btn-primary mr-1 ml-1 mt-3">{c.name}</a>
      </Link>
    ));

  const showBlogTags = (blog) =>
    blog.tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a className="btn btn-outline-primary mr-1 ml-1 mt-3">{t.name}</a>
      </Link>
    ));

  const showRelatedBlog = () =>
    related.map((blog, i) => (
      <div className="col-md-4" key={i}>
        <article>
          <SmallCard blog={blog} />
        </article>
      </div>
    ));
  const showComments = () => {
    return (
      <>
        <DisqusThread id={blog._id} title={blog.title} path={`/blog/${blog.slug}`} />
      </>
    );
  };

  //TODO: make a title responsive
  return (
    <>
      {head()}
      <Layout>
        <main>
          <article>
            <div className="container-fluid">
              <section>
                <div className="row" style={{ marginTop: '-30px' }}>
                  <img
                    className="img img-fluid featured-image"
                    src={`${API}/blog/photo/${blog.slug}`}
                    alt={blog.title}
                  />
                </div>
              </section>
              <section>
                <div className="container">
                  <h1 className="display-2 pt-3 pb-3 text-center font-weight-bold">{blog.title}</h1>
                  <p className="lead mt-3 mark">
                    Written by{' '}
                    <Link href={`/profile/${blog.postedBy.username}`}>
                      <a>{blog.postedBy.username}</a>
                    </Link>{' '}
                    | Published
                    {moment(blog.updateAt).fromNow()}
                  </p>
                  <div className="pb-3">
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                  </div>
                </div>
              </section>
            </div>
            <div className="container">
              <section>
                <div className="col-md-12 lead">{renderHTML(blog.body)}</div>
              </section>
            </div>
            <div className="container pb-5">
              <h4 className="text-center pt-5 pb-5 h2">Related blogs</h4>
              <hr />
              <div className="row">{showRelatedBlog()}</div>
            </div>
            <div className="container pt-5 pb-5">
              <p>{showComments()}</p>
            </div>
          </article>
        </main>
      </Layout>
    </>
  );
}

SingleBlog.getInitialProps = ({ query }) => {
  //This run in the backend
  return singleBlog(query.slug).then((data) => {
    if (data.error) {
      console.log(data.error);
    } else {
      return { blog: data, query };
    }
  });
};
