import Logo from '../../../public/assets/SiteLogo.png';
import styles from './Header.module.css';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogoClick = () => {
        navigate('/');
        setMenuOpen(false);
    };

    const handleNavClick = () => {
        setMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <button 
                    className={styles.logoButton} 
                    onClick={handleLogoClick}
                    aria-label="На главную"
                    title="На главную"
                >
                    <img src={Logo} alt="Логотип онлайн-библиотеки" className={styles.logoImage} />
                    <span className={styles.logoText}>MyLib</span>
                </button>

                <nav className={styles.desktopNav} aria-label="Основная навигация">
                    <NavLink 
                        to="/books" 
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                        title="Перейти к разделу книг"
                    >
                        Книги
                    </NavLink>
                    <NavLink 
                        to="/genres" 
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                        title="Перейти к разделу жанров литературы"
                    >
                        Жанры
                    </NavLink>
                    <NavLink 
                        to="/authors" 
                        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                        title="Перейти к разделу авторов"
                    >
                        Авторы
                    </NavLink>
                </nav>

                <button 
                    className={`${styles.menuButton} ${menuOpen ? styles.open : ''}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
                    aria-expanded={menuOpen}
                >
                    <span className={styles.menuIcon}></span>
                </button>
            </div>

            {menuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className={styles.mobileNav} aria-label="Мобильная навигация">
                        <NavLink 
                            to="/books" 
                            className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                            onClick={handleNavClick}
                            title="Перейти к разделу книг"
                        >
                            Книги
                        </NavLink>
                        <NavLink 
                            to="/genres" 
                            className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                            onClick={handleNavClick}
                            title="Перейти к разделу жанров литературы"
                        >
                            Жанры
                        </NavLink>
                        <NavLink 
                            to="/authors" 
                            className={({ isActive }) => `${styles.mobileNavLink} ${isActive ? styles.active : ''}`}
                            onClick={handleNavClick}
                            title="Перейти к разделу авторов"
                        >
                            Авторы
                        </NavLink>
                    </nav>
                </div>
            )}
        </header>
    );
}

export default Header;