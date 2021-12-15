import { useState, useEffect } from 'react';
import { getCookie, updateUser } from '../../actions/auth';
import { getProfile, update } from '../../actions/user';
import { API } from '../../config';

export default function ProfileUpdate() {
  const [values, setValues] = useState({
    username: '',
    name: '',
    email: '',
    about: '',
    password: '',
    error: false,
    success: false,
    loading: false,
    photo: '',
    userData: '',
  });
  const token = getCookie('token');
  const {
    username,
    name,
    email,
    about,
    password,
    error,
    success,
    loading,
    photo,
    userData,
  } = values;
  const init = () => {
    getProfile(token).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          username: data.username,
          name: data.name,
          email: data.email,
          about: data.about || '',
        });
      }
    });
  };
  useEffect(() => {
    init();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true });
    update(token, userData).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, success: false, loading: false });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            username: data.username,
            name: data.name,
            email: data.email,
            about: data.about || '',
            success: true,
            loading: false,
          });
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    const userFormData = new FormData();
    userFormData.set(name, value);
    setValues({ ...values, [name]: value, userData: userFormData, error: false, success: false });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="btn btn-outline-info">
          Profile photo
          <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
        </label>
      </div>
      <div className="form-group">
        <label className="text-muted">Username</label>
        <input
          className="form-control"
          onChange={handleChange('username')}
          type="text"
          value={username}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input className="form-control" onChange={handleChange('name')} type="text" value={name} />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          className="form-control"
          onChange={handleChange('email')}
          type="email"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          className="form-control"
          onChange={handleChange('password')}
          type="password"
          value={password}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">About</label>
        <input
          className="form-control"
          onChange={handleChange('about')}
          type="text"
          value={about}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
  const showLoading = () => (
    <div className="alert alert-info" style={{ display: loading ? '' : 'none' }}>
      Loading...
    </div>
  );
  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );
  const showSuccess = () => (
    <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
      Profile updated
    </div>
  );
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            {!!username && (
              <img
                src={`${API}/user/photo/${username}`}
                alt="user profile"
                className="img img-fluid img-thumbnail mb-3"
                style={{ maxHeight: 'auto', width: '100%' }}
              />
            )}
          </div>
          <div className="col-md-8 mb-5">
            {showLoading()}
            {showError()}
            {showSuccess()}
            {profileUpdateForm()}
          </div>
        </div>
      </div>
    </>
  );
}
