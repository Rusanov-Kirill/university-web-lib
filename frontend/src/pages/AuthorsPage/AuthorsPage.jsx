import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import AuthorCard from '../../components/AuthorCard/AuthorCard';
import SearchField from '../../components/SearchField/SearchField';
import BookCard from '../../components/BookCard/BookCard';
import styles from './AuthorsPage.module.css';
import { useState, useEffect } from 'react';

function AuthorsPage() {
    const [authors, setAuthors] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [booksCount, setBooksCount] = useState({});
    
    const [showBooksModal, setShowBooksModal] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState(null);
    const [authorBooks, setAuthorBooks] = useState([]);
    const [booksLoading, setBooksLoading] = useState(false);
    const [booksError, setBooksError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const authorsResponse = await fetch('http://localhost/api/authors_extraction.php');
                if (!authorsResponse.ok) {
                    throw new Error(`Ошибка сервера: ${authorsResponse.status}`);
                }

                const authorsData = await authorsResponse.json();
                
                if (authorsData.error) {
                    throw new Error(authorsData.error);
                }

                if (Array.isArray(authorsData)) {
                    setAuthors(authorsData);
                    setFilteredAuthors(authorsData);
                    await fetchBooksCount(authorsData);
                } else {
                    throw new Error('Некорректный формат данных от сервера');
                }
            } catch (err) {
                setError(err.message);
                console.error('Ошибка при загрузке авторов:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchBooksCount = async (authorsList) => {
        try {
            const counts = {};
            
            for (const author of authorsList) {
                try {
                    const response = await fetch(
                        `http://localhost/api/books_search_author.php?author=${encodeURIComponent(author.name)}`
                    );
                    
                    if (response.ok) {
                        const books = await response.json();
                        counts[author.id] = Array.isArray(books) ? books.length : 0;
                    } else {
                        counts[author.id] = 0;
                    }
                } catch {
                    counts[author.id] = 0;
                }
            }
            
            setBooksCount(counts);
        } catch (err) {
            console.error('Ошибка при загрузке количества книг:', err);
        }
    };

    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredAuthors(authors);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = authors.filter(author => 
            author.name.toLowerCase().includes(query) ||
            author.description.toLowerCase().includes(query)
        );
        
        setFilteredAuthors(filtered);
    }, [searchQuery, authors]);

    const handleViewAuthorBooks = async (authorName) => {
        try {
            setBooksLoading(true);
            setBooksError(null);
            setSelectedAuthor(authorName);
            
            const response = await fetch(
                `http://localhost/api/books_search_author.php?author=${encodeURIComponent(authorName)}`
            );
            
            if (!response.ok) {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
            
            const books = await response.json();
            
            if (Array.isArray(books)) {
                setAuthorBooks(books);
                setShowBooksModal(true);
            } else {
                throw new Error('Некорректный формат данных');
            }
        } catch (err) {
            setBooksError(err.message);
            console.error('Ошибка при загрузке книг автора:', err);
        } finally {
            setBooksLoading(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const closeBooksModal = () => {
        setShowBooksModal(false);
        setSelectedAuthor(null);
        setAuthorBooks([]);
        setBooksError(null);
    };

    const totalAuthors = authors.length;
    const totalBooks = Object.values(booksCount).reduce((sum, count) => sum + count, 0);
    const mostProlificAuthor = authors.length > 0 
        ? authors.reduce((max, author) => 
            (booksCount[author.id] || 0) > (booksCount[max.id] || 0) ? author : max
          )
        : null;

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Авторы библиотеки</h1>
                        <p className={styles.heroSubtitle}>
                            Познакомьтесь с выдающимися писателями, чьи произведения составляют основу нашей библиотеки.
                        </p>
                    </div>
                </section>

                <section className={styles.searchSection}>
                    <div className={styles.searchContainer}>
                        <SearchField 
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Поиск авторов по имени или описанию..."
                        />
                        
                        {searchQuery && (
                            <button 
                                className={styles.clearButton}
                                onClick={handleClearSearch}
                                aria-label="Очистить поиск"
                            >
                                Очистить
                            </button>
                        )}
                    </div>

                    <div className={styles.statsSection}>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>✍️</div>
                            <div className={styles.statContent}>
                                <h3 className={styles.statNumber}>{totalAuthors}</h3>
                                <p className={styles.statLabel}>Авторов</p>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>📚</div>
                            <div className={styles.statContent}>
                                <h3 className={styles.statNumber}>{totalBooks}</h3>
                                <p className={styles.statLabel}>Всего книг</p>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statIcon}>🏆</div>
                            <div className={styles.statContent}>
                                <h3 className={styles.statName}>
                                    {mostProlificAuthor?.name || '—'}
                                </h3>
                                <p className={styles.statLabel}>
                                    Самый плодовитый автор
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className={styles.statusMessage}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Загрузка авторов...</p>
                    </div>
                ) : error ? (
                    <div className={styles.statusMessage}>
                        <div className={styles.errorIcon}>⚠️</div>
                        <div className={styles.errorContent}>
                            <h3>Произошла ошибка</h3>
                            <p className={styles.errorDetail}>{error}</p>
                        </div>
                        <button 
                            className={styles.retryButton}
                            onClick={() => window.location.reload()}
                        >
                            Попробовать снова
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.resultsInfo}>
                            <h2 className={styles.resultsTitle}>
                                {searchQuery 
                                    ? `Найдено авторов: ${filteredAuthors.length}` 
                                    : 'Все авторы'
                                }
                            </h2>
                            {searchQuery && (
                                <p className={styles.searchQuery}>
                                    По запросу: "{searchQuery}"
                                </p>
                            )}
                        </div>

                        <section className={styles.authorsGrid}>
                            {filteredAuthors.length > 0 ? (
                                filteredAuthors.map((author) => (
                                    <AuthorCard
                                        key={author.id}
                                        id={author.id}
                                        image={author.image}
                                        name={author.name}
                                        description={author.description}
                                        bookCount={booksCount[author.id] || 0}
                                        onViewBooks={handleViewAuthorBooks}
                                    />
                                ))
                            ) : (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>👤</div>
                                    <div className={styles.emptyContent}>
                                        <h3>Авторы не найдены</h3>
                                        <p>
                                            {searchQuery 
                                                ? `По запросу "${searchQuery}" авторов не найдено.`
                                                : 'В библиотеке пока нет авторов.'
                                            }
                                        </p>
                                        {searchQuery && (
                                            <button 
                                                className={styles.browseButton}
                                                onClick={handleClearSearch}
                                            >
                                                Показать всех авторов
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>

                        {filteredAuthors.length > 0 && (
                            <div className={styles.tipSection}>
                                <div className={styles.tipContent}>
                                    <div className={styles.tipIcon}>💡</div>
                                    <div className={styles.tipText}>
                                        <h3>Как использовать</h3>
                                        <p>
                                            Нажмите на карточку автора или кнопку "Посмотреть книги", 
                                            чтобы увидеть все произведения этого автора в нашей библиотеке.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />

            {showBooksModal && (
                <div className={styles.modalOverlay} onClick={closeBooksModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                Книги автора: {selectedAuthor}
                            </h2>
                            <button 
                                className={styles.modalCloseButton}
                                onClick={closeBooksModal}
                                aria-label="Закрыть"
                            >
                                ✕
                            </button>
                        </div>
                        
                        <div className={styles.modalBody}>
                            {booksLoading ? (
                                <div className={styles.modalLoading}>
                                    <div className={styles.loadingSpinner}></div>
                                    <p>Загрузка книг...</p>
                                </div>
                            ) : booksError ? (
                                <div className={styles.modalError}>
                                    <div className={styles.errorIcon}>⚠️</div>
                                    <p>Ошибка при загрузке книг: {booksError}</p>
                                    <button 
                                        className={styles.retryButton}
                                        onClick={() => handleViewAuthorBooks(selectedAuthor)}
                                    >
                                        Попробовать снова
                                    </button>
                                </div>
                            ) : authorBooks.length > 0 ? (
                                <>
                                    <p className={styles.booksCount}>
                                        Найдено книг: {authorBooks.length}
                                    </p>
                                    <div className={styles.booksGrid}>
                                        {authorBooks.map((book) => (
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
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className={styles.modalEmpty}>
                                    <div className={styles.emptyIcon}>📚</div>
                                    <h3>Книги не найдены</h3>
                                    <p>У автора "{selectedAuthor}" пока нет книг в нашей библиотеке.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className={styles.modalFooter}>
                            <button 
                                className={styles.modalClose}
                                onClick={closeBooksModal}
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AuthorsPage;