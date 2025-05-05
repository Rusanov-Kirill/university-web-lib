import styles from './Footer.module.css'

function Footer() {
    const CURRENT_YEAR = new Date().getFullYear();
    return (
        <footer className={styles.footer}>
            <p className={styles.p}>© {CURRENT_YEAR} MyLib official site</p>
            <p className={styles.p}>Rusanov Industry Online Lib</p>
        </footer>
    )
}

export default Footer