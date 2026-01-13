import styles from './SearchField.module.css';
import SecurityUtils from '../../utils/validation';

function SearchField({ value = '', onChange, placeholder = 'Поиск книг...' }) {
    const handleChange = (e) => {
        if (onChange) {
            if (SecurityUtils.validateSearchQuery(e.target.value)) {
                onChange(e.target.value);
            }
        }
    };

    return (
        <div className={styles.searchContainer}>
            <input
                type="search"
                className={styles.searchInput}
                placeholder={SecurityUtils.escapeHtml(placeholder)}
                value={value}
                onChange={handleChange}
                maxLength="200"
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