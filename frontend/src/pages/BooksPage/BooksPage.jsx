import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Card from '../../components/Card/Card'
import SearchField from '../../components/SearchField/SearchField'
import styles from './BooksPage.module.css'
import { books } from '../../mocks/books'
import { useWindowWidth } from '../../hooks/useWindowWidth'

function BooksPage() {
    const width = useWindowWidth();
    let cards = '';

    switch(true) {
        case (width > 480 && width <= 1024):
            cards = books.length < 3 ? 'cards-less-3' : 'cards-more-3';
            break;
        case (width > 1024):
            cards = books.length < 6 ? 'cards-less-6' : 'cards-more-6';
            break;
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <SearchField />
                <div className={styles[`${cards}`]}>
                    {books.map(book => (
                        <Card 
                            key={book.id}
                            id={book.id}
                            image={book.image}
                            title={book.title}
                            author={book.author}
                            genres={book.genres}
                        />
                    ))}
                </div>
            </main>
            <Footer />
        </>
    )
}

export default BooksPage