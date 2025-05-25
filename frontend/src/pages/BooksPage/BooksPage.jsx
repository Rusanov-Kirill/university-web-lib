import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Card from '../../components/Card/Card'
import SearchField from '../../components/SearchField/SearchField'
import styles from './BooksPage.module.css'
import { useState, useEffect } from 'react'
import { useWindowWidth } from '../../hooks/useWindowWidth'

function BooksPage() {
    const width = useWindowWidth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost/api/books_extraction.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Ошибка HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setBooks(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (error) console.log(error);

    let cards = '';

    switch (true) {
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
                    {loading ? <div className={styles['loading-wrapper']}>Loading...</div> : (
                        books.map(book => (
                            <Card
                                key={book.id}
                                id={book.id}
                                image={book.image}
                                title={book.title}
                                author={book.author}
                                genres={book.genres}
                            />
                        ))
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

export default BooksPage