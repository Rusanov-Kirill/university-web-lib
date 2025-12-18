import styles from './SearchField.module.css';

function SearchField({ value = '', onChange, placeholder = 'Поиск книг...' }) {
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className={styles.searchContainer}>
            <input 
                type="search"
                className={styles.searchInput}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                aria-label="Поиск книг"
            />
            <button 
                className={styles.searchButton}
                type="button"
                aria-label="Начать поиск"
            >
                🔍
            </button>
        </div>
    );
}

export default SearchField;