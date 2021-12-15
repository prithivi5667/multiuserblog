import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { getCookie, isAuth } from '../../actions/auth';
import { singleBlog, updateBlog } from '../../actions/blog';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { Quillmodules, Quillformats } from '../../helpers/quill';
import { DOMAIN, API } from '../../config';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function BlogUpdate() {
  const router = useRouter();
  const [body, setBody] = useState('');
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);
  const [checked, setChecked] = useState([]);
  const [checkedTag, setCheckedTag] = useState([]);

  const [values, setValues] = useState({
    title: '',
    error: '',
    success: '',
    formData: '',
    body: '',
  });

  const { error, success, formData, title } = values;
  const token = getCookie('token');
  const initCategories = () => {
    getCategories().then((data) =>
      data.error ? setValues({ ...values, error: data.error }) : setCategories(data),
    );
  };
  const initTags = () => {
    getTags().then((data) =>
      data.error ? setValues({ ...values, error: data.error }) : setTags(data),
    );
  };
  const findOutCategory = (c) => {
    const result = checked.indexOf(c);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const findOutTag = (t) => {
    const result = checkedTag.indexOf(t);
    if (result !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const showCategories = () => {
    return (
      categories &&
      categories.map((c, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleToggle(c._id)}
            checked={findOutCategory(c._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{c.name}</label>
        </li>
      ))
    );
  };

  const handleToggle = (c) => () => {
    setValues({ ...values, error: '' });
    // return the first index or -1
    const clickedCategory = checked.indexOf(c);
    const all = [...checked];

    if (clickedCategory === -1) {
      all.push(c);
    } else {
      all.splice(clickedCategory, 1);
    }
    console.log(all);
    setChecked(all);
    formData.set('categories', all);
  };

  const handleTagsToggle = (t) => () => {
    setValues({ ...values, error: '' });
    // return the first index or -1
    const clickedTag = checkedTag.indexOf(t);
    const all = [...checkedTag];

    if (clickedTag === -1) {
      all.push(t);
    } else {
      all.splice(clickedTag, 1);
    }
    console.log(all);
    setCheckedTag(all);
    formData.set('tags', all);
  };

  const showTags = () => {
    return (
      tags &&
      tags.map((t, i) => (
        <li key={i} className="list-unstyled">
          <input
            onChange={handleTagsToggle(t._id)}
            checked={findOutTag(t._id)}
            type="checkbox"
            className="mr-2"
          />
          <label className="form-check-label">{t.name}</label>
        </li>
      ))
    );
  };
  const initBlog = () => {
    if (router.query.slug) {
      singleBlog(router.query.slug).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          setValues({ ...values, title: data.title });
          setBody(data.body);
          setCategoriesArray(data.categories);
          setTagsArray(data.tags);
        }
      });
    }
  };

  const setCategoriesArray = (blogCategories) => {
    let ca = [];
    blogCategories.map((c, i) => {
      ca.push(c._id);
    });
    setChecked(ca);
  };

  const setTagsArray = (blogTags) => {
    let ta = [];
    blogTags.map((t, i) => {
      ta.push(t._id);
    });
    setCheckedTag(ta);
  };

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
    initBlog();
  }, [router]);

  const handleBody = (e) => {
    setBody(e);
    formData.set('body', e);
  };
  const handleChange = (name) => (e) => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });
  };
  const editBlog = (e) => {
    e.preventDefault();
    updateBlog(formData, token, router.query.slug).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          title: '',
          success: `Blog titled "${data.title}" is  successfully updated`,
        });
        if (isAuth()) {
          router.replace(`/${isAuth().role === 1 ? 'admin' : 'user'}`);
        }
      }
    });
  };
  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );
  const showSucess = () => (
    <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
      {success}
    </div>
  );

  const updateBlogForm = () => {
    return (
      <form onSubmit={editBlog}>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={handleChange('title')}
          />
        </div>
        <div className="form-group">
          <ReactQuill
            modules={Quillmodules}
            formats={Quillformats}
            value={body}
            placeholder="Write something amazing..."
            onChange={handleBody}
          />
        </div>
        <div>
          <button className="btn btn-primary">Update</button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8">
          {updateBlogForm()}
          <div className="pt-3">
            {showSucess()}
            {showError()}
          </div>
          {body && (
            <img
              src={`${API}/blog/photo/${router.query.slug}`}
              alt={title}
              style={{ width: '100%' }}
            />
          )}
        </div>
        <div className="col-md-4">
          <div>
            <div className="form-group pb-2">
              <h5>Feature image</h5>
              <hr />
              <small className="text-muted">Max size: 1mb</small>
              <label className="ml-2 btn btn-outline-info">
                Upload feature image
                <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
              </label>
            </div>
            <div>
              <h5>Categories</h5>
              <hr />
              <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}> {showCategories()}</ul>
            </div>
            <div>
              <h5>Tags</h5>
              <ul style={{ maxHeight: '200px', overflowY: 'scroll' }}> {showTags()}</ul>
              <hr />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}