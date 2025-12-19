import styles from './AuthorCard.module.css';
import { useState } from 'react';

const AuthorCard = ({ id, image, name, description, bookCount, onViewBooks }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleViewBooks = async (e) => {
        e.stopPropagation();
        
        if (onViewBooks) {
            setIsLoading(true);
            try {
                await onViewBooks(name);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCardClick = (e) => {
        if (!e.target.closest('button')) {
            handleViewBooks(e);
        }
    };

    const truncateDescription = (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const getInitials = (authorName) => {
        const names = authorName.split(' ');
        if (names.length >= 2) {
            return (names[0][0] + names[1][0]).toUpperCase();
        }
        return authorName.substring(0, 2).toUpperCase();
    };

    return (
        <div
            id={`author-${id}`}
            className={styles.authorCard}
            onClick={handleCardClick}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(e);
                }
            }}
            role="button"
            tabIndex={0}
            aria-label={`Автор ${name}, ${bookCount} книг. Нажмите, чтобы посмотреть книги автора`}
        >
            <div className={styles.avatarContainer}>
                {image ? (
                    <img 
                        src={image} 
                        alt={`Фото автора ${name}`}
                        className={styles.authorImage}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.querySelector(`.${styles.initialsAvatar}`).style.display = 'flex';
                        }}
                    />
                ) : null}
                
                <div className={`${styles.initialsAvatar} ${image ? styles.hidden : ''}`}>
                    {getInitials(name)}
                </div>
            </div>

            <div className={styles.authorInfo}>
                <h3 className={styles.authorName} title={name}>
                    {name}
                </h3>
                
                <div className={styles.bookCount}>
                    <span className={styles.countNumber}>{bookCount}</span>
                    <span className={styles.countLabel}>
                        {bookCount === 1 ? 'книга' : 
                         bookCount >= 2 && bookCount <= 4 ? 'книги' : 'книг'}
                    </span>
                </div>
                
                <p className={styles.authorDescription} title={description}>
                    {truncateDescription(description, 150)}
                </p>
                
                <div className={styles.authorFooter}>
                    <button 
                        className={styles.viewButton}
                        onClick={handleViewBooks}
                        disabled={isLoading}
                        aria-label={`Посмотреть книги автора ${name}`}
                    >
                        {isLoading ? (
                            <>
                                <span className={styles.loadingSpinner}></span>
                                Загрузка...
                            </>
                        ) : (
                            <>
                                Посмотреть книги
                                <span className={styles.buttonArrow}>→</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthorCard;