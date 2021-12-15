import { useState, useEffect } from 'react';
import { getCookie } from '../../actions/auth';
import { create, getTags, removeTag } from '../../actions/tag';

export default function Tag() {
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    tags: [],
    removed: false,
    reload: false,
  });

  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie('token');

  const loadTags = () => {
    getTags().then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        setValues({ ...values, tags: data });
      }
    });
  };

  useEffect(() => {
    loadTags();
  }, [reload]);

  const deleteConfirm = (slug) => {
    let answer = window.confirm('Are you sure you want to delete this tag?');
    answer && deleteTag(slug);
  };
  const deleteTag = (slug) => {
    removeTag(slug, token).then((data) => {
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
  const showTags = () =>
    tags.map((t, i) => (
      <button
        onDoubleClick={() => deleteConfirm(c.slug)}
        title="Double click to delete"
        key={i}
        className="btn btn-outline-primary mr-1 ml-1 mt-3"
      >
        {t.name}
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

  const showSucess = () => success && <p className="text-success">Tag is created</p>;
  const showError = () => error && <p className="text-danger">Tag already exist</p>;
  const showRemoved = () => removed && <p className="text-danger">Tag is removed</p>;

  const mouseLeaveHandler = () =>
    setValues({ ...values, error: false, success: false, removed: '' });

  const newTagForm = () => (
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
        {newTagForm()}
        {showTags()}
      </div>
    </>
  );
}
