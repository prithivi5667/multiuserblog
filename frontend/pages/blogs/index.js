import Layout from '../../components/Layout';
import { listBlogsWithCategoriesAndTags } from '../../actions/blog';
import Card from '../../components/blog/Card';
import Link from 'next/link';
import { APP_NAME, DOMAIN, FB_APP_ID } from '../../config';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useState } from 'react';

export default function Blogs({ blogs, categories, tags, totalBlogs, blogsLimit, blogSkip }) {
  const head = () => (
    <Head>
      <title>Programming blogs | {APP_NAME}</title>
      <meta
        name="description"
        content="Programming blogs and tutorials on react node next vue php laravel and web development"
      />
      <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`Lastest development tutorials | ${APP_NAME}`} />
      <meta
        property="og:description"
        content="Programming blogs and tutorials on react node next vue php laravel and web development"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:image" content={`${DOMAIN}/static/images/seoblog.jpg`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/static/images/seoblog.jpg`} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={`${FB_APP_ID || ''}`} />
    </Head>
  );

  const router = useRouter();
  const [limit, setLimit] = useState(blogsLimit);
  const [skip, setSkip] = useState(0);
  const [size, setSize] = useState(totalBlogs);
  const [loadedBlogs, setLoadedBlogs] = useState([]);

  const loadMore = () => {
    let toSkip = skip + limit;
    listBlogsWithCategoriesAndTags(toSkip, limit).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setLoadedBlogs([...loadedBlogs, ...data.blogs]);
        setSize(data.size);
        setSkip(toSkip);
      }
    });
  };
  const loadMoreButton = () => {
    return (
      size > 0 &&
      size >= limit && (
        <button onClick={loadMore} className="btn btn-outline-primary btn-lg">
          Load more
        </button>
      )
    );
  };
  const showAllBlogs = () => {
    return blogs.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
        <hr />
      </article>
    ));
  };
  const showAllCategories = () =>
    categories.map((c, i) => (
      <Link key={i} href={`/categories/${c.slug}`}>
        <a href="" className="btn btn-primary mr-1 ml-1 mt-3">
          {c.name}
        </a>
      </Link>
    ));
  const showAllTags = () =>
    tags.map((t, i) => (
      <Link key={i} href={`/tags/${t.slug}`}>
        <a href="" className="btn btn-outline-primary mr-1 ml-1 mt-3">
          {t.name}
        </a>
      </Link>
    ));
  const showLoadedBlogs = () => {
    return loadedBlogs.map((blog, i) => (
      <article key={i}>
        <Card blog={blog} />
      </article>
    ));
  };

  return (
    <>
      {head()}
      <Layout>
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Programming blogs and tutorials
                </h1>
              </div>
              <section>
                <div className="pb-5 text-center">
                  {showAllCategories()}
                  <br />
                  {showAllTags()}
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">{showAllBlogs()}</div>
          <div className="container-fluid">{showLoadedBlogs()}</div>
          <div className="text-center pt-5 pb-5">{loadMoreButton()}</div>
        </main>
      </Layout>
    </>
  );
}

Blogs.getInitialProps = async () => {
  const skip = 0;
  const limit = 2;
  const data = await listBlogsWithCategoriesAndTags(skip, limit);
  if (data.error) {
    console.log(data.error);
  } else {
    return {
      blogs: data.blogs,
      categories: data.categories,
      tags: data.tags,
      totalBlogs: data.size,
      blogsLimit: limit,
      blogsSkip: skip,
    };
  }
};
