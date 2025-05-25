import styles from './Card.module.css'

const Card = ({id, image, title, author, genres}) => {
    return (
        <div className={styles.card}>
            <img src={image} alt={title} className={styles.image} />
            <div className={styles['book-info-container']}>
                <h3 className={styles['title-mobile']}>{title}</h3>
                <p className={styles['author-mobile']}>{author}</p>
                <p className={styles['genres-mobile']}>{genres.join(', ')}</p>
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.author}>{author}</p>
            <p className={styles.genres}>{genres.join(', ')}</p>
        </div>
    )
}

export default Card