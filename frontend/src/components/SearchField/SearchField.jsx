import styles from './SearchField.module.css'

function SearchField() {
    return (
        <input placeholder='Поиск' className={styles['search-field']}></input>
    )
}

export default SearchField