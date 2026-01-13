import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './GenresPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const genreIcons = {
    'Фантастика': '🚀',
    'Детектив': '🔍',
    'Роман': '❤️',
    'Фэнтэзи': '🧙‍♂️',
    'Научная литература': '🔬',
    'Биография': '👤',
    'Поэзия': '✍️',
    'Исторический': '🏰',
    'Приключения': '🗺️',
    'Ужасы': '👻',
    'Юмор': '😂',
    'Драма': '🎭',
    'Классика': '📜',
    'Научпоп': '⚛️',
    'Психология': '🧠',
    'Бизнес': '💼',
    'Кулинария': '🍳',
    'Детская литература': '🧸',
    'Техническая литература': '⚙️',
    'Справочная литература': '📚',
    'Художественная литература': '🎨',
    'Религия': '🕊️',
    'Философия': '🧘',
    'Политика': '🏛️',
    'Спорт': '⚽',
    'Искусство': '🎭',
    'Музыка': '🎵',
    'Путешествия': '✈️',
    'Эзотерика': '🔮',
    'Юридическая литература': '⚖️',
    'Медицина': '🏥',
    'Экономика': '📈',
    'Маркетинг': '📢',
    'Программирование': '💻',
    'Дизайн': '🎨',
    'Комедия': '😂',
    'Утопия': '🏙️',
    'Психологический триллер': '🧠🔪'
};

const genreDescriptions = {
    'Фантастика': 'Исследование будущего, технологий и космоса',
    'Детектив': 'Загадки, расследования и интеллектуальные головоломки',
    'Роман': 'Истории о чувствах, отношениях и жизненных перипетиях',
    'Фэнтэзи': 'Волшебство, магия и вымышленные миры',
    'Научная литература': 'Факты, исследования и научные открытия',
    'Биография': 'Истории жизни известных людей',
    'Поэзия': 'Ритм, рифма и глубина чувств',
    'Исторический': 'Погружение в прошлое и исторические события',
    'Приключения': 'Путешествия, опасности и открытия',
    'Ужасы': 'Страх, напряжение и сверхъестественное',
    'Юмор': 'Смех, ирония и комедийные ситуации',
    'Драма': 'Конфликты, эмоции и человеческие взаимоотношения',
    'Классика': 'Вечные произведения, проверенные временем',
    'Научпоп': 'Наука понятным языком',
    'Психология': 'Разум, поведение и человеческая природа',
    'Бизнес': 'Карьера, финансы и предпринимательство',
    'Кулинария': 'Рецепты, кулинарное искусство и гастрономия',
    'Детская литература': 'Для самых маленьких читателей',
    'Техническая литература': 'Технические руководства и документация',
    'Справочная литература': 'Энциклопедии, словари и справочники',
    'Художественная литература': 'Художественные произведения различных жанров',
    'Религия': 'Религиозные тексты и духовная литература',
    'Философия': 'Философские труды и размышления',
    'Политика': 'Политические исследования и теории',
    'Спорт': 'Спортивная литература и биографии атлетов',
    'Искусство': 'Искусствоведение и художественные альбомы',
    'Музыка': 'Музыкальная теория и биографии музыкантов',
    'Путешествия': 'Путеводители и рассказы о путешествиях',
    'Эзотерика': 'Эзотерические знания и духовные практики',
    'Юридическая литература': 'Юридические документы и комментарии',
    'Медицина': 'Медицинская литература и исследования',
    'Экономика': 'Экономические теории и аналитика',
    'Маркетинг': 'Маркетинговые стратегии и кейсы',
    'Программирование': 'Языки программирования и разработка',
    'Дизайн': 'Дизайн-мышление и визуальное искусство',
    'Комедия': 'Смешные истории и комедийные ситуации',
    'Утопия': 'Идеальные миры и социальные утопии',
    'Психологический триллер': 'Психологические загадки и напряженные ситуации'
};

function GenresPage() {
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [hoveredGenre, setHoveredGenre] = useState(null);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const genresResponse = await fetch('/api/get_genres.php');
                const genresData = await genresResponse.json();

                const countResponse = await fetch('/api/get_books_count.php');
                const countData = await countResponse.json();

                const allBooksCount = await fetch('/api/books_extraction.php');
                const allBooksData = await allBooksCount.json();
                setBooks(allBooksData);

                const mergedData = genresData.map(genre => {
                    const countInfo = countData.find(c => c.id === genre.id);
                    return {
                        ...genre,
                        book_count: countInfo ? countInfo.book_count : 0
                    };
                });

                const sortedData = mergedData.sort((a, b) => b.book_count - a.book_count);
                
                setGenres(sortedData);
            } catch (err) {
                setError(err.message);
                console.error('Ошибка загрузки:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleGenreClick = (genre) => {
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        const genreElement = document.getElementById(`genre-${genre.id}`);
        if (genreElement) {
            genreElement.style.transform = 'scale(0.95)';
            setTimeout(() => {
                genreElement.style.transform = 'scale(1)';
                navigate(`/books?genre=${encodeURIComponent(genre.title)}`);
            }, 150);
        } else {
            navigate(`/books?genre=${encodeURIComponent(genre.title)}`);
        }
    };

    const handleGenreHover = (genreId, isHovering) => {
        setHoveredGenre(isHovering ? genreId : null);
    };

    const totalGenres = genres.length;
    const totalBooks = books.length;
    const mostPopularGenre = genres.length > 0 ? genres[0] : null; 

    const getGenreIcon = (genreTitle) => {
        return genreIcons[genreTitle] || '📖';
    };

    const getGenreDescription = (genreTitle, bookCount) => {
        const description = genreDescriptions[genreTitle] || 'Разнообразные произведения этого жанра';
        
        if (bookCount > 0) {
            return description;
        }
        return 'Пока нет книг в этом жанре';
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                <section className={styles.hero}>
                    <div className={styles.heroContent}>
                        <h1 className={styles.heroTitle}>Жанры литературы</h1>
                        <p className={styles.heroSubtitle}>
                            Исследуйте мир литературы по жанрам. Каждый жанр — это отдельная вселенная со своими героями, историями и атмосферой.
                        </p>
                    </div>
                </section>

                {loading ? (
                    <div className={styles.statusMessage}>
                        <div className={styles.loadingSpinner}></div>
                        <p>Загрузка жанров...</p>
                    </div>
                ) : error ? (
                    <div className={styles.statusMessage}>
                        <div className={styles.errorIcon}>⚠️</div>
                        <p>Произошла ошибка при загрузке жанров</p>
                        <p className={styles.errorDetail}>{error}</p>
                        <button
                            className={styles.retryButton}
                            onClick={() => window.location.reload()}
                        >
                            Попробовать снова
                        </button>
                    </div>
                ) : (
                    <>
                        <div className={styles.infoSection}>
                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>📚</div>
                                <h3>Всего жанров</h3>
                                <p className={styles.infoNumber}>{totalGenres}</p>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>🔢</div>
                                <h3>Всего книг</h3>
                                <p className={styles.infoNumber}>{totalBooks}</p>
                            </div>
                            <div className={styles.infoCard}>
                                <div className={styles.infoIcon}>🎯</div>
                                <h3>Популярный жанр</h3>
                                <p className={styles.infoText}>
                                    {mostPopularGenre?.title || '—'}
                                </p>
                            </div>
                        </div>

                        <section className={styles.genresSection}>
                            <div className={styles.sectionHeader}>
                                <h2 className={styles.sectionTitle}>Все жанры</h2>
                                <p className={styles.sectionSubtitle}>
                                    Нажмите на жанр, чтобы увидеть все книги в этой категории
                                </p>
                            </div>

                            {genres.length === 0 ? (
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIcon}>📚</div>
                                    <h3>Жанры не найдены</h3>
                                    <p>В библиотеке пока нет жанров. Попробуйте зайти позже.</p>
                                </div>
                            ) : (
                                <div className={styles.genresGrid}>
                                    {genres.map((genre) => {
                                        const bookCount = genre.book_count || 0; 
                                        const icon = getGenreIcon(genre.title);
                                        const isPopular = bookCount > 0; 
                                        const isHovered = hoveredGenre === genre.id;

                                        return (
                                            <div
                                                key={genre.id}
                                                id={`genre-${genre.id}`}
                                                className={`${styles.genreCard} ${isPopular && bookCount > 0 ? styles.popular : ''}`}
                                                onClick={() => handleGenreClick(genre)}
                                                onMouseEnter={() => handleGenreHover(genre.id, true)}
                                                onMouseLeave={() => handleGenreHover(genre.id, false)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        handleGenreClick(genre);
                                                    }
                                                }}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Перейти к жанру ${genre.title}, ${bookCount} книг`}
                                            >
                                                <div className={styles.genreHeader}>
                                                    <div className={styles.genreIcon}>
                                                        {icon}
                                                    </div>
                                                    {isPopular && bookCount > 0 && (
                                                        <span className={styles.popularBadge}>
                                                            {bookCount > 3 ? 'Популярный' : 'Есть книги'}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className={styles.genreContent}>
                                                    <h3 className={styles.genreTitle}>{genre.title}</h3>
                                                    <p className={styles.genreDescription}>
                                                        {getGenreDescription(genre.title, bookCount)}
                                                    </p>
                                                </div>

                                                <div className={styles.genreFooter}>
                                                    <div className={styles.bookCount}>
                                                        <span className={styles.countNumber}>{bookCount}</span>
                                                        <span className={styles.countLabel}>книг</span>
                                                    </div>
                                                    <div className={styles.genreAction}>
                                                        <span className={styles.actionText}>
                                                            {isHovered ? 'Перейти →' : 'Посмотреть'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>

                        <div className={styles.tipSection}>
                            <div className={styles.tipContent}>
                                <div className={styles.tipIcon}>💡</div>
                                <div className={styles.tipText}>
                                    <h3>Как работают жанры</h3>
                                    <p>
                                        Книги могут принадлежать к нескольким жанрам одновременно. 
                                        Количество книг показывает, сколько произведений связано с этим жанром.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default GenresPage;