import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Card from '../../components/Card/Card'
import SearchField from '../../components/SearchField/SearchField'
import styles from './BooksPage.module.css'
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { useWindowWidth } from '../../hooks/useWindowWidth'

function BooksPage() {
    const location = useLocation();
    const width = useWindowWidth();

    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = new URLSearchParams(location.search);
    const genreFilter = params.get('genre') || '';

    useEffect(() => {
        setLoading(true);
        setError(null);

        if (query.trim() !== '') {
            // Поиск по названию
            fetch(`http://localhost/api/books_search.php?title=${encodeURIComponent(query)}`)
                .then(res => {
                    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    // Фильтруем по жанру, если он есть
                    const filtered = genreFilter
                        ? data.filter(book => book.genres.includes(genreFilter))
                        : data;
                    setBooks(filtered);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        } else {
            // Если нет поиска — запрашиваем по жанру или все книги
            let url = 'http://localhost/api/books_extraction.php';
            if (genreFilter) {
                url = `http://localhost/api/books_by_genre.php?genre=${encodeURIComponent(genreFilter)}`;
            }

            fetch(url)
                .then(res => {
                    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
                    return res.json();
                })
                .then(data => {
                    setBooks(data);
                    setLoading(false);
                })
                .catch(err => {
                    setError(err.message);
                    setLoading(false);
                });
        }
    }, [query, genreFilter]);


    let cardsClass = '';
    if (width > 480 && width <= 1024) {
        cardsClass = books.length < 3 ? 'cards-less-3' : 'cards-more-3';
    } else if (width > 1024) {
        cardsClass = books.length < 6 ? 'cards-less-6' : 'cards-more-6';
    }

    return (
        <>
            <Header />
            <main className={styles.main}>
                <SearchField value={query} onChange={setQuery} />
                <div className={styles[cardsClass]}>
                    {loading ? (
                        <div className={styles['loading-wrapper']}>Loading...</div>
                    ) : (
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
    );
}

export default BooksPage;
