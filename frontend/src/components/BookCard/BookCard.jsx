import styles from './BookCard.module.css';

const BookCard = ({ id, image, title, author, genres, year, rating }) => {
    const truncateText = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div 
            className={styles.card} 
            role="button"
            tabIndex={0}
            aria-label={`Книга "${title}" автора ${author}`}
        >
            <div className={styles.imageContainer}>
                <img 
                    src={image || '/default-book-cover.jpg'} 
                    alt={`Обложка книги "${title}"`}
                    className={styles.image}
                    onError={(e) => {
                        e.target.src = '/default-book-cover.jpg';
                    }}
                />
                {rating && (
                    <div className={styles.ratingBadge}>
                        ⭐ {rating.toFixed(1)}
                    </div>
                )}
            </div>
            
            <div className={styles.content}>
                <h3 className={styles.title} title={title}>
                    {truncateText(title, 60)}
                </h3>
                <p className={styles.author} title={author}>
                    {truncateText(author, 50)}
                </p>
                
                <div className={styles.genres}>
                    {Array.isArray(genres) ? genres.slice(0, 2).map((genre, index) => (
                        <span key={index} className={styles.genreTag}>
                            {genre}
                        </span>
                    )) : (
                        <span className={styles.genreTag}>{genres}</span>
                    )}
                    {Array.isArray(genres) && genres.length > 2 && (
                        <span className={styles.moreGenres}>+{genres.length - 2}</span>
                    )}
                </div>
                
                <div className={styles.footer}>
                    {year && <span className={styles.year}>{year}</span>}
                    <button 
                        className={styles.detailsButton}
                        aria-label={`Подробнее о книге "${title}"`}
                    >
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;