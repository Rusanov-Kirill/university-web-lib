import SearchField from '../SearchField/SearchField.jsx'
import Logo from '../../../public/assets/SiteLogo.png'
import styles from './Header.module.css'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

function Header() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleOpenMenu = () => {
        setMenuOpen(prevState => !prevState);
    }

    return (
        <header className={styles.header}>
            <div className={styles['tablet-head']}>
                <div className={styles['lib-logo']} onClick={() => navigate('/')}>
                    <img src={Logo} alt='MyLib Logo' draggable='false' />
                    <span className={styles['site-title']}>MyLib</span>
                </div>
                <div className={styles['search-field']}>
                    <SearchField />
                </div>
            </div>
            <button type='button' onClick={handleOpenMenu} className={styles['menu-container']}>
                <svg fill="#fff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="40px" height="40px" viewBox="0 0 24 24" xmlSpace="preserve">
                    <g>
                        <path d="M0,3.875c0-1.104,0.896-2,2-2h20.75c1.104,0,2,0.896,2,2s-0.896,2-2,2H2C0.896,5.875,0,4.979,0,3.875z M22.75,10.375H2
                        c-1.104,0-2,0.896-2,2c0,1.104,0.896,2,2,2h20.75c1.104,0,2-0.896,2-2C24.75,11.271,23.855,10.375,22.75,10.375z M22.75,18.875H2
                        c-1.104,0-2,0.896-2,2s0.896,2,2,2h20.75c1.104,0,2-0.896,2-2S23.855,18.875,22.75,18.875z"/>
                    </g>
                </svg>
            </button>
            <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
                <NavLink to="/books" className={({ isActive }) => isActive ? styles.active : ''}>Книги</NavLink>
                <NavLink to="/genres" className={({ isActive }) => isActive ? styles.active : ''}>Жанры</NavLink>
                <NavLink to="/authors" className={({ isActive }) => isActive ? styles.active : ''}>Авторы</NavLink>
            </nav>
        </header>
    );
}

export default Header
