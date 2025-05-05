import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import SearchField from '../../components/SearchField/SearchField'
import AuthorCard from '../../components/AuthorCard/AuthorCard'
import styles from './AuthorsPage.module.css'
import { authors } from '../../mocks/authors'

function AuthorsPage() {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <SearchField />
                {authors.map(author => (
                    <AuthorCard key={author.id} image={author.image} name={author.name} description={author.description} />
                ))}
            </main>
            <Footer />
        </>
    )
}

export default AuthorsPage