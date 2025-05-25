import { useState } from 'react';
import styles from './SearchField.module.css'

function SearchField() {
    const [query, setQuery] = useState('');

    const handleChange = (e) => {
        const value = e.target.value;
        setQuery(value);
        onSearch(value);  
    };

    return (
        <input 
            placeholder='Поиск' 
            className={styles['search-field']}
            value={query}
            onChange={handleChange}
        />
    )
}

export default SearchField