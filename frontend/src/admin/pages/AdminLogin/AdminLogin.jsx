import styles from './AdminLogin.module.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function AdminLogin() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost/api/admin/user_login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: formData.login,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (data.is_admin) {
          const loginTime = new Date().getTime();
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminLoginTime', loginTime.toString());
          navigate('/admin');
        }
      } else {
        if (response.status === 403) {
          setError('Отказано в доступе');
        } else if (response.status === 401) {
          setError('Неверный логин или пароль');
        } else {
          setError('Произошла ошибка');
        }
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <>
      <main className={styles.main}>
        <div className={styles['login-container']}>
          <h1 className={styles.title}>Вход в админ панель</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles['input-group']}>
              <label htmlFor="login" className={styles.label}>
                Логин
              </label>
              <input
                type="text"
                id="login"
                name="login"
                value={formData.login}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles['input-group']}>
              <label htmlFor="password" className={styles.label}>
                Пароль
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.button}
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>

          <hr className={styles.divider} />

          <button
            onClick={handleGoHome}
            className={styles.homeButton}
          >
            Вернуться на главную
          </button>

          <div className={styles.testData}>
            <h3>Тестовые данные для входа:</h3>
            <p><strong>Админ:</strong> login: admin | pass: admin123</p>
            <p><strong>Юзер:</strong> login: user | pass: user123</p>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminLogin;