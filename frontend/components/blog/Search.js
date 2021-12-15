import React, { useState } from 'react';
import { listSearch } from '../../actions/blog';
import Link from 'next/link';
export default function Search() {
  const [values, setValues] = useState({
    search: undefined,
    result: [],
    searched: false,
    message: '',
  });
  const { search, result, searched, message } = values;
  const searchSubmit = (e) => {
    e.preventDefault();
    listSearch({ search }).then((data) => {
      setValues({
        ...values,
        result: data,
        searched: true,
        message: `${data.length || 0} blogs found`,
      });
    });
  };
  const handleChange = (e) => {
    setValues({ ...values, search: e.target.value, searched: false, result: [] });
  };
  const searchedBlogs = (results = []) => {
    return (
      <div className="jumbotron bg-white">
        {message && <p className="pt-4 text-muted form-italic">{message}</p>}
        {results.map((blog, i) => (
          <div key={i}>
            <Link href={`/blogs/${blog.slug}`}>
              <a className="text-primary">{blog.title}</a>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  const searchForm = () => (
    <form onSubmit={searchSubmit}>
      <div className="row">
        <div className="col-md-8">
          <input
            type="search"
            className="form-control"
            placeholder="Search blogs"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-block btn-outline-primary" type="submit">
            Search
          </button>
        </div>
      </div>
    </form>
  );
  return (
    <div className="container-fluid">
      <div className="pt-3 pb-5">{searchForm()}</div>
      {searched && !result.error && (
        <div style={{ marginTop: '-120px', marginBottom: '-80px' }}>{searchedBlogs(result)}</div>
      )}
    </div>
  );
}
