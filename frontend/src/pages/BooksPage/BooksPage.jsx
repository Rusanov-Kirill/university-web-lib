import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import BookCard from '../../components/BookCard/BookCard';
import SearchField from '../../components/SearchField/SearchField';
import SecurityUtils from '../../utils/validation';
import styles from './BooksPage.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function BooksPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [query, setQuery] = useState('');
    const [searchBy, setSearchBy] = useState('title');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeGenre, setActiveGenre] = useState('');

    const params = new URLSearchParams(location.search);
    const genreFilter = params.get('genre') || '';

    useEffect(() => {
        setLoading(true);
        setError(null);
        setActiveGenre(genreFilter);

        const fetchBooks = async () => {
            try {
                if (query && !SecurityUtils.validateSearchQuery(query)) {
                    throw new Error('Некорректный поисковый запрос');
                }

                if (genreFilter && !SecurityUtils.validateSearchQuery(genreFilter)) {
                    throw new Error('Некорректный жанр');
                }

                let url = '/api/books_extraction.php';

                if (query.trim() !== '') {
                    const endpoint = searchBy === 'title'
                        ? 'books_search.php'
                        : 'books_search_author.php';
                    url = `/api/${endpoint}?${searchBy}=${encodeURIComponent(query)}`;
                } else if (genreFilter) {
                    url = `/api/books_by_genre.php?genre=${encodeURIComponent(genreFilter)}`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

                const data = await response.json();

                const safeData = Array.isArray(data)
                    ? data.map(book => ({
                        ...book,
                        title: SecurityUtils.escapeHtml(book.title),
                        author: SecurityUtils.escapeHtml(book.author),
                    }))
                    : [];
                setBooks(safeData);
            } catch (err) {
                setError(err.message);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [query, searchBy, genreFilter]);

    const handleClearFilters = () => {
        navigate('/books');
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.searchSection}>
                    <div className={styles.searchContainer}>
                        <div className={styles.searchOptions}>
                            <div className={styles.radioGroup}>
                                <button
                                    className={`${styles.radioButton} ${searchBy === 'title' ? styles.active : ''}`}
                                    onClick={() => setSearchBy('title')}
                                    aria-pressed={searchBy === 'title'}
                                >
                                    По названию
                                </button>
                                <button
                                    className={`${styles.radioButton} ${searchBy === 'author' ? styles.active : ''}`}
                                    onClick={() => setSearchBy('author')}
                                    aria-pressed={searchBy === 'author'}
                                >
                                    По автору
                                </button>
                            </div>
                            <SearchField
                                value={query}
                                onChange={setQuery}
                                placeholder={searchBy === 'title' ? 'Введите название книги...' : 'Введите имя автора...'}
                            />
                        </div>
                    </div>
                </section>

                <div className={styles.resultsInfo}>
                    {loading ? (
                        <div className={styles.statusMessage}>
                            <div className={styles.loadingSpinner}></div>
                            <p>Загрузка книг...</p>
                        </div>
                    ) : error ? (
                        <div className={styles.statusMessage}>
                            <div className={styles.errorIcon}>⚠️</div>
                            <p>Произошла ошибка: {error}</p>
                            <button
                                className={styles.retryButton}
                                onClick={() => window.location.reload()}
                            >
                                Попробовать снова
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className={styles.resultsTitle}>
                                {activeGenre ? `Книги в жанре "${activeGenre}"` : 'Все книги'}
                                {query && ` по запросу "${query}"`}
                            </h2>
                            <p className={styles.resultsCount}>Найдено книг: {books.length}</p>
                        </>
                    )}
                </div>

                {!loading && !error && (
                    <section className={styles.booksGrid}>
                        {books.length > 0 ? (
                            books.map((book) => (
                                <BookCard
                                    key={book.id}
                                    id={book.id}
                                    image={book.image}
                                    title={book.title}
                                    author={book.author}
                                    genres={book.genres}
                                    year={book.year}
                                    rating={book.rating}
                                />
                            ))
                        ) : (
                            <div className={styles.emptyState}>
                                <div className={styles.emptyIcon}>📚</div>
                                <h3>Книги не найдены</h3>
                                <p>Попробуйте изменить поисковый запрос или выберите другой жанр</p>
                                <button
                                    className={styles.browseButton}
                                    onClick={handleClearFilters}
                                >
                                    Показать все книги
                                </button>
                            </div>
                        )}
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}

export default BooksPage;