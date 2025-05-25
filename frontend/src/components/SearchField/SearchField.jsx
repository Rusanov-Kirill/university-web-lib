import { useState } from 'react';
import styles from './SearchField.module.css'

function SearchField({ value, onChange }) {
    return (
        <input 
            placeholder='Поиск' 
            className={styles['search-field']}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    )
}

export default SearchField