import styles from './Footer.module.css';
import { NavLink } from 'react-router-dom';

function Footer() {
    const CURRENT_YEAR = new Date().getFullYear();
    
    return (
        <footer className={styles.footer} aria-label="Подвал сайта">
            <div className={styles.footerContent}>
                
                <div className={styles.footerSection}>
                    <h3 className={styles.sectionTitle}>О библиотеке</h3>
                    <p className={styles.description}>
                        Онлайн-библиотека с тысячами книг на любой вкус. 
                        Читайте классику и современную литературу без ограничений.
                    </p>
                    <div className={styles.contactInfo}>
                        <p>📧 rusanovkirill39@gmail.com</p>
                    </div>
                </div>
                
                <div className={styles.footerSection}>
                    <h3 className={styles.sectionTitle}>Разделы</h3>
                    <nav className={styles.footerNav} aria-label="Футерная навигация">
                        <NavLink to="/books" className={styles.navLink} title="Перейти к разделу книг">Книги</NavLink>
                        <NavLink to="/genres" className={styles.navLink} title="Перейти к разделу жанров литературы">Жанры</NavLink>
                        <NavLink to="/authors" className={styles.navLink} title="Перейти к разделу авторов">Авторы</NavLink>
                    </nav>
                </div>
                
            </div>
            
            <div className={styles.footerBottom}>
                <div className={styles.copyright}>
                    <p>© {CURRENT_YEAR} Онлайн-библиотека. Все права защищены.</p>
                    <p className={styles.credits}>Rusanov Industry Online Lib</p>
                </div>
                
                <div className={styles.socialLinks}>
                    <a 
                        href="https://t.me/LvMashiro_7" 
                        className={styles.telegramLink}
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label="Наш Telegram"
                        title="Перейти в наш Telegram-канал"
                    >
                        <span className={styles.telegramIcon}>✈️</span>
                        <span>Telegram</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;