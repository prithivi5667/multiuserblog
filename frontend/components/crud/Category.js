import { useState, useEffect } from 'react';
import { getCookie } from '../../actions/auth';
import { create, getCategories, removeCategory } from '../../actions/category';

export default function Category() {
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    categories: [],
    removed: false,
    reload: false,
  });

  const { name, error, success, categories, removed, reload } = values;
  const token = getCookie('token');

  const loadCategories = () => {
    getCategories().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, categories: data });
      }
    });
  };

  useEffect(() => {
    loadCategories();
  }, [reload]);

  const deleteConfirm = (slug) => {
    let answer = window.confirm('Are you sure you want to delete this category?');
    answer && deleteCategory(slug);
  };
  const deleteCategory = (slug) => {
    removeCategory(slug, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({
          ...values,
          error: false,
          success: false,
          name: '',
          removed: !removed,
          reload: !reload,
        });
      }
    });
  };
  const showCategories = () =>
    categories.map((c, i) => (
      <button
        onDoubleClick={() => deleteConfirm(c.slug)}
        title="Double click to delete"
        key={i}
        className="btn btn-outline-primary mr-1 ml-1 mt-3"
      >
        {c.name}
      </button>
    ));
  const clickSubmit = (e) => {
    e.preventDefault();
    create({ name }, token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({
          ...values,
          error: false,
          success: true,
          removed: false,
          reload: !reload,
          name: '',
        });
      }
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      name: e.target.value,
      error: false,
      success: false,
      reload: false,
      removed: false,
    });
  };

  const showSucess = () => success && <p className="text-success">Category is created</p>;
  const showError = () => error && <p className="text-danger">Category already exist</p>;
  const showRemoved = () => removed && <p className="text-danger">Category is removed</p>;

  const mouseLeaveHandler = () =>
    setValues({ ...values, error: false, success: false, removed: '' });

  const newCategoryForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input type="text" className="form-control" onChange={handleChange} value={name} required />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Create
        </button>
      </div>
    </form>
  );
  return (
    <>
      {showSucess()}
      {showError()}
      {showRemoved()}
      <div onMouseMove={mouseLeaveHandler}>
        {newCategoryForm()}
        {showCategories()}
      </div>
    </>
  );
}
