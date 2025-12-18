import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './HomePage.module.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const handleCatalogClick = () => {
        navigate('/books');
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Онлайн-библиотека</h1>
                        <p className={styles.heroSubtitle}>
                            Откройте для себя мир литературы. Тысячи книг в одном месте.
                        </p>
                        <div className={styles.ctaSection}>
                            <button 
                                className={styles.catalogCtaButton}
                                onClick={handleCatalogClick}
                            >
                                <span className={styles.buttonIcon}>📚</span>
                                <span className={styles.buttonText}>Перейти к каталогу</span>
                                <span className={styles.arrow}>→</span>
                            </button>
                            <p className={styles.ctaHint}>
                                Откройте наш обширный каталог с тысячами книг
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.quickStart}>
                    <h2 className={styles.sectionTitle}>С чего начать?</h2>
                    <div className={styles.startGrid}>
                        <div className={styles.startCard}>
                            <div className={styles.cardIcon}>🔍</div>
                            <h3 className={styles.cardTitle}>Исследуйте</h3>
                            <p className={styles.cardText}>
                                Просматривайте книги по категориям и авторам
                            </p>
                        </div>
                        <div className={styles.startCard}>
                            <div className={styles.cardIcon}>📖</div>
                            <h3 className={styles.cardTitle}>Читайте</h3>
                            <p className={styles.cardText}>
                                Начинайте чтение сразу после выбора книги
                            </p>
                        </div>
                        <div className={styles.startCard}>
                            <div className={styles.cardIcon}>⭐</div>
                            <h3 className={styles.cardTitle}>Сохраняйте</h3>
                            <p className={styles.cardText}>
                                Добавляйте понравившиеся книги в избранное
                            </p>
                        </div>
                    </div>
                </section>

                <section className={styles.benefits}>
                    <h2 className={styles.sectionTitle}>Почему наша библиотека?</h2>
                    <div className={styles.benefitsGrid}>
                        <div className={styles.benefitItem}>
                            <h3 className={styles.benefitTitle}>Без ограничений</h3>
                            <p className={styles.benefitText}>
                                Читайте с любого устройства в любое время.
                            </p>
                        </div>
                        <div className={styles.benefitItem}>
                            <h3 className={styles.benefitTitle}>Простой интерфейс</h3>
                            <p className={styles.benefitText}>
                                Интуитивно понятный дизайн, созданный для комфортного чтения.
                            </p>
                        </div>
                        <div className={styles.benefitItem}>
                            <h3 className={styles.benefitTitle}>Разнообразие</h3>
                            <p className={styles.benefitText}>
                                Классика, современная проза, научная литература — все в одном месте.
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}

export default HomePage;