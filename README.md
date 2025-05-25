# University Web Library

Веб-приложение для отображения библиотеки книг. Разрабатывается по дисциплине из университета - Веб-разработка. 

## 🚀 Как запустить проект локально

```
git clone https://github.com/Rusanov-Kirill/university-web-lib.git
cd university-web-lib
cd frontend
npm install
cd ..
cd backend
composer install
php -S localhost:8000
start nginx // В папке где у вас на ПК находиться nginx.exe
```

БД и файл .env в backend папке надо создавать самому - проект учебный и на общедоступность не претенудует

После запуска открой в браузере: http://localhost

## 📦 Используемые технологии
    
    - React

    - CSS Modules

    - Vite

    - PHP

    - Ngnix

## 🛠 Требования

    - Node.js версии 18 и выше

    - npm или yarn для управления зависимостями

    - PHP версии 8 и выше (для работы backend API)

    - PostgreSQL (или другая СУБД, используемая в проекте) — для хранения данных книг

    - Nginx — настроенный как обратный прокси для маршрутизации запросов к PHP backend

    - Composer (рекомендуется) — для управления PHP-зависимостями, если используются