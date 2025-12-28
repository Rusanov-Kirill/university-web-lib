import styles from './AdminLogin.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasYandexId, setHasYandexId] = useState(false);
  const [showYandexLinkPrompt, setShowYandexLinkPrompt] = useState(false);
  const [pendingToken, setPendingToken] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const yandexId = localStorage.getItem('adminYandexId');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const loginTime = localStorage.getItem('adminLoginTime');

    if (yandexId) {
      setHasYandexId(true);
    }

    if (isAdmin && loginTime) {
      navigate('/admin');
    }
  }, [navigate]);

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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleYandexLogin = async () => {
    const yandexId = localStorage.getItem('adminYandexId');
    if (!yandexId) {
      setError('Yandex ID не найден');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost/api/admin/verify_yandex.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ yandex_id: yandexId })
      });

      const data = await response.json();

      if (data.success && data.is_admin) {
        const loginTime = new Date().getTime();
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminLoginTime', loginTime.toString());
        navigate('/admin');
      } else {
        if (data.clear_localstorage) {
          localStorage.removeItem('adminYandexId');
          setHasYandexId(false);
          setError('Yandex ID недействителен. Привяжите заново.');
        } else {
          setError('Ошибка проверки Яндекс ID');
        }
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleYandexLink = () => {
    console.log('Привязка Яндекс с токеном:', pendingToken);
    const clientId = import.meta.env.VITE_YANDEX_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost/api/admin/yandex_callback.php');
    const state = encodeURIComponent(pendingToken);

    const authUrl = `https://oauth.yandex.com/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&prompt=login`;

    window.location.href = authUrl;
  };

  const handleCancelYandexLink = () => {
    setShowYandexLinkPrompt(false);
    setPendingToken('');
    // Просто переходим в админку без привязки Яндекс
    localStorage.setItem('isAdmin', 'true');
    localStorage.setItem('adminLoginTime', new Date().getTime().toString());
    navigate('/admin');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShowYandexLinkPrompt(false);
    setPendingToken('');

    try {
      const response = await fetch('http://localhost/api/admin/user_login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: formData.login,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.is_admin) {
          // Если у админа уже привязан Яндекс ID
          if (data.yandex_linked) {
            const loginTime = new Date().getTime();
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('adminLoginTime', loginTime.toString());
            navigate('/admin');
          } else {
            // ПРЕДЛАГАЕМ привязать Яндекс ID, но не заставляем
            // Сохраняем временный токен для возможной привязки
            setPendingToken(data.pending_token);
            setShowYandexLinkPrompt(true);
          }
        } else {
          setError('Доступ только для администраторов');
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

          {hasYandexId && !showYandexLinkPrompt && (
            <button
              onClick={handleYandexLogin}
              className={`${styles.button} ${styles.yandexButton}`}
              disabled={loading}
              style={{ marginBottom: '20px' }}
            >
              🚀 Войти через Яндекс (1 клик)
            </button>
          )}

          {!showYandexLinkPrompt ? (
            <>
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles['input-group']}>
                  <label htmlFor="login" className={styles.label}>Логин</label>
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
                  <label htmlFor="password" className={styles.label}>Пароль</label>
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
                  <div className={styles.error}>{error}</div>
                )}

                <button
                  type="submit"
                  className={styles.button}
                  disabled={loading}
                >
                  {loading ? 'Вход...' : 'Войти по логину'}
                </button>
              </form>
            </>
          ) : (
            <div className={styles.yandexPrompt}>
              <h3>Привязать Яндекс ID для быстрого входа?</h3>
              <p>Для ускоренного входа в будущем вы можете привязать ваш аккаунт Яндекс.</p>
              <p>Это позволит вам входить в админ-панель одним кликом.</p>

              <div className={styles.buttonGroup}>
                <button
                  onClick={handleYandexLink}
                  className={`${styles.button} ${styles.yandexButton}`}
                  style={{ marginBottom: '10px' }}
                >
                  Да, привязать Яндекс
                </button>

                <button
                  onClick={handleCancelYandexLink}
                  className={styles.button}
                  style={{
                    backgroundColor: '#6c757d',
                    marginBottom: '10px'
                  }}
                >
                  Нет, войти без привязки
                </button>

                <button
                  onClick={() => setShowYandexLinkPrompt(false)}
                  className={styles.homeButton}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          <hr className={styles.divider} />

          <button
            onClick={handleGoHome}
            className={styles.homeButton}
          >
            Вернуться на главную
          </button>

          <div className={styles.testData}>
            <h3>Тестовые данные:</h3>
            <p><strong>Админ:</strong> login: admin | pass: admin123</p>
            <p><strong>Юзер:</strong> login: user | pass: user123</p>
          </div>
        </div>
      </main>
    </>
  );
}

export default AdminLogin;