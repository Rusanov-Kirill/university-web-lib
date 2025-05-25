import styles from './AuthorCard.module.css'

function AuthorCard({ image, name, description }) {
    return (
        <div className={styles.container}>
            <img alt={name} src={image} className={styles.image} draggable='false'></img>
            <div className={styles['author-text-container']}>
                <span className={styles['authors-name']}>{name}</span>
                <p className={styles['authors-description']}>{description}</p>
            </div>
        </div>
    )
}

export default AuthorCard