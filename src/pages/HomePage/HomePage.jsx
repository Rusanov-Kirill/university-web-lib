import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import styles from './HomePage.module.css'

function HomePage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles['welcome-sign']}>
                    <p className={styles['welcome-text']}>Добро пожаловать в нашу онлайн-библиотеку!</p>
                    <p className={styles['welcome-text']}>Здесь вы найдете тысячи книг на любой вкус — от классики до современных бестселлеров. Читайте, изучайте, открывайте новые миры вместе с нами!</p>
                </div>
                <div className={styles['description-container']}>
                    <p className={styles['site-description']}>Наша онлайн-библиотека — это место, где каждый может найти книгу по душе. Мы собрали тысячи произведений разных жанров: классику, фантастику, детективы, научную литературу и многое другое.</p>
                    <p className={styles['site-description']}>Здесь вы можете читать книги в любое время и с любого устройства. Удобный поиск и категории помогут быстро найти нужное произведение.</p>
                    <p className={styles['site-description']}>Открывайте для себя новых авторов, перечитывайте любимые книги и наслаждайтесь миром литературы без ограничений. Добро пожаловать в библиотеку, где каждая страница — новое открытие!</p>
                </div>
            </main>
            <Footer />
        </>
    )
}

export default HomePage