import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminYandexComplete() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linked = params.get('yandex_linked');
    const yandexIdFromUrl = params.get('yandex_id');

    // *** Если пришла успешная привязка Яндекса ***
    if (linked === '1' && yandexIdFromUrl) {
      // Сохраняем yandex_id НАВСЕГДА в localStorage
      localStorage.setItem('adminYandexId', yandexIdFromUrl);
      
      // Устанавливаем сессию админа
      const loginTime = Date.now();
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminLoginTime', loginTime.toString());
      
      navigate('/admin', { replace: true });
      return;
    }

    // Если что-то пошло не так — назад на логин
    navigate('/admin-login', { replace: true });
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      Завершаем вход через Яндекс...
    </div>
  );
}

export default AdminYandexComplete;
