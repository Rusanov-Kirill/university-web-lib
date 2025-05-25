import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import styles from './GenresPage.module.css'
import { useNavigate } from 'react-router-dom'
import { genres } from '../../mocks/genres'

function GenresPage() {
    const navigate = useNavigate()

    const handleGenreClick = (genre) => {
        navigate(`/books?genre=${encodeURIComponent(genre)}`)
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles['genres-sign']}>
                    {genres.map(genre => (
                        <div
                            key={genre.id}
                            className={styles['genreItem']}
                            onClick={() => handleGenreClick(genre.title)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.title}>{genre.title}</div>
                            <div className={styles.pages}>{genre.pages}</div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}

export default GenresPage
