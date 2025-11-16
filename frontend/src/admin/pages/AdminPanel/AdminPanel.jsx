import Header from '../../../components/Header/Header'
import Footer from '../../../components/Footer/Footer'
import styles from './AdminPanel.module.css'
import { useState, useEffect } from 'react'
import { useWindowWidth } from '../../../hooks/useWindowWidth'

function AdminPanel() {
    const width = useWindowWidth();
    const [activeTab, setActiveTab] = useState('books');
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [genres, setGenres] = useState([]);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [bookForm, setBookForm] = useState({ 
        title: '', 
        author: '', 
        image: null, 
        genres: [] 
    });
    const [authorForm, setAuthorForm] = useState({ 
        name: '', 
        description: '', 
        image: null 
    });
    const [genreForm, setGenreForm] = useState({ title: '' });

    const [editingItem, setEditingItem] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [editImage, setEditImage] = useState(null);

    const [bookPreview, setBookPreview] = useState('');
    const [authorPreview, setAuthorPreview] = useState('');

    useEffect(() => {
        loadData();
        loadAvailableGenres();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [booksRes, authorsRes, genresRes] = await Promise.all([
                fetch('http://localhost/api/books_extraction.php'),
                fetch('http://localhost/api/authors_extraction.php'),
                fetch('http://localhost/api/genres_extraction.php')
            ]);

            if (!booksRes.ok || !authorsRes.ok || !genresRes.ok) {
                throw new Error('Ошибка загрузки данных');
            }

            const booksData = await booksRes.json();
            const authorsData = await authorsRes.json();
            const genresData = await genresRes.json();

            setBooks(booksData);
            setAuthors(authorsData);
            setGenres(genresData);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const loadAvailableGenres = async () => {
        try {
            const response = await fetch('http://localhost/api/genres_extraction.php');
            const data = await response.json();
            setAvailableGenres(data);
        } catch (err) {
            console.error('Ошибка загрузки жанров:', err);
        }
    };

    const handleBookImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBookForm({...bookForm, image: file});
            setBookPreview(URL.createObjectURL(file));
        }
    };

    const handleAuthorImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAuthorForm({...authorForm, image: file});
            setAuthorPreview(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditImage(file);
            if (editingItem.type === 'book') {
                setBookPreview(URL.createObjectURL(file));
            } else {
                setAuthorPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleBookSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('title', bookForm.title);
            formData.append('author', bookForm.author);
            formData.append('genres', JSON.stringify(bookForm.genres));
            
            if (bookForm.image) {
                formData.append('image', bookForm.image);
            }

            const response = await fetch('http://localhost/api/admin/add_book.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setBookForm({ title: '', author: '', image: null, genres: [] });
                setBookPreview('');
                loadData();
            } else {
                setError(result.error || 'Ошибка при добавлении книги');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAuthorSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', authorForm.name);
            formData.append('description', authorForm.description);
            
            if (authorForm.image) {
                formData.append('image', authorForm.image);
            }

            const response = await fetch('http://localhost/api/admin/add_author.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (response.ok) {
                setAuthorForm({ name: '', description: '', image: null });
                setAuthorPreview('');
                loadData();
            } else {
                setError(result.error || 'Ошибка при добавлении автора');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGenreSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost/api/admin/add_genre.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(genreForm)
            });
            
            if (response.ok) {
                setGenreForm({ title: '' });
                loadData();
                loadAvailableGenres();
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const startEdit = (type, item) => {
        setEditingItem({ type, id: item.id });
        setEditForm({ ...item });
        setEditImage(null);
        
        if (type === 'book' && item.image) {
            setBookPreview(item.image);
        } else if (type === 'author' && item.image) {
            setAuthorPreview(item.image);
        }
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditForm({});
        setEditImage(null);
        setBookPreview('');
        setAuthorPreview('');
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const { type, id } = editingItem;
            const endpoint = `http://localhost/api/admin/update_${type}.php`;
            
            if (type === 'book' || type === 'author') {
                const formData = new FormData();
                formData.append('id', id);
                
                if (type === 'book') {
                    formData.append('title', editForm.title);
                    formData.append('author', editForm.author);
                    formData.append('genres', JSON.stringify(editForm.genres || []));
                } else {
                    formData.append('name', editForm.name);
                    formData.append('description', editForm.description);
                }
                
                if (editImage) {
                    formData.append('image', editImage);
                }

                const response = await fetch(endpoint, {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    setEditingItem(null);
                    setEditForm({});
                    setEditImage(null);
                    setBookPreview('');
                    setAuthorPreview('');
                    loadData();
                } else {
                    setError(result.error || 'Ошибка при обновлении');
                }
            } else {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, ...editForm })
                });
                
                if (response.ok) {
                    setEditingItem(null);
                    setEditForm({});
                    loadData();
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (type, id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) return;
        
        try {
            const response = await fetch(`http://localhost/api/admin/delete_${type}.php?id=${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                loadData();
                if (type === 'genre') {
                    loadAvailableGenres();
                }
            }
        } catch (err) {
            setError(err.message);
        }
    };

    let cardsClass = '';
    if (width > 480 && width <= 1024) {
        cardsClass = 'cards-tablet';
    } else if (width > 1024) {
        cardsClass = 'cards-desktop';
    }

    const renderForm = () => {
        if (editingItem) {
            const { type } = editingItem;
            return (
                <div className={styles.editSection}>
                    <h2>Редактирование {type === 'book' ? 'книги' : type === 'author' ? 'автора' : 'жанра'}</h2>
                    <form onSubmit={handleEditSubmit} className={styles.form}>
                        {type === 'book' && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Название книги"
                                    value={editForm.title || ''}
                                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Автор"
                                    value={editForm.author || ''}
                                    onChange={(e) => setEditForm({...editForm, author: e.target.value})}
                                    required
                                />
                                
                                <div className={styles.imageUpload}>
                                    <label>Обложка книги:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditImageChange}
                                    />
                                    {bookPreview && (
                                        <div className={styles.imagePreview}>
                                            <img src={bookPreview} alt="Preview" />
                                        </div>
                                    )}
                                    {!bookPreview && editForm.image && (
                                        <div className={styles.imagePreview}>
                                            <img src={editForm.image} alt="Current" />
                                            <span>Текущее изображение</span>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.genreSelection}>
                                    <label>Жанры:</label>
                                    <div className={styles.genreCheckboxes}>
                                        {availableGenres.map(genre => (
                                            <label key={genre.id} className={styles.genreCheckbox}>
                                                <input
                                                    type="checkbox"
                                                    checked={Array.isArray(editForm.genres) ? editForm.genres.includes(genre.title) : false}
                                                    onChange={(e) => {
                                                        const currentGenres = Array.isArray(editForm.genres) ? editForm.genres : [];
                                                        const updatedGenres = e.target.checked
                                                            ? [...currentGenres, genre.title]
                                                            : currentGenres.filter(g => g !== genre.title);
                                                        setEditForm({...editForm, genres: updatedGenres});
                                                    }}
                                                />
                                                {genre.title}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                        
                        {type === 'author' && (
                            <>
                                <input
                                    type="text"
                                    placeholder="Имя автора"
                                    value={editForm.name || ''}
                                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                                    required
                                />
                                <textarea
                                    placeholder="Описание"
                                    value={editForm.description || ''}
                                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    required
                                />
                                
                                <div className={styles.imageUpload}>
                                    <label>Фото автора:</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleEditImageChange}
                                    />
                                    {authorPreview && (
                                        <div className={styles.imagePreview}>
                                            <img src={authorPreview} alt="Preview" />
                                        </div>
                                    )}
                                    {!authorPreview && editForm.image && (
                                        <div className={styles.imagePreview}>
                                            <img src={editForm.image} alt="Current" />
                                            <span>Текущее изображение</span>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                        
                        {type === 'genre' && (
                            <input
                                type="text"
                                placeholder="Название жанра"
                                value={editForm.title || ''}
                                onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                required
                            />
                        )}
                        
                        <div className={styles.editButtons}>
                            <button type="submit" className={styles.saveBtn}>Сохранить</button>
                            <button type="button" onClick={cancelEdit} className={styles.cancelBtn}>Отмена</button>
                        </div>
                    </form>
                </div>
            );
        }

        return (
            <div className={styles.formSection}>
                <h2>Добавить новую запись</h2>
                {activeTab === 'books' && (
                    <form onSubmit={handleBookSubmit} className={styles.form}>
                        <input
                            type="text"
                            placeholder="Название книги"
                            value={bookForm.title}
                            onChange={(e) => setBookForm({...bookForm, title: e.target.value})}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Автор"
                            value={bookForm.author}
                            onChange={(e) => setBookForm({...bookForm, author: e.target.value})}
                            required
                        />
                        
                        <div className={styles.imageUpload}>
                            <label>Обложка книги:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleBookImageChange}
                                required
                            />
                            {bookPreview && (
                                <div className={styles.imagePreview}>
                                    <img src={bookPreview} alt="Preview" />
                                </div>
                            )}
                        </div>

                        <div className={styles.genreSelection}>
                            <label>Жанры:</label>
                            <div className={styles.genreCheckboxes}>
                                {availableGenres.map(genre => (
                                    <label key={genre.id} className={styles.genreCheckbox}>
                                        <input
                                            type="checkbox"
                                            checked={bookForm.genres.includes(genre.title)}
                                            onChange={(e) => {
                                                const updatedGenres = e.target.checked
                                                    ? [...bookForm.genres, genre.title]
                                                    : bookForm.genres.filter(g => g !== genre.title);
                                                setBookForm({...bookForm, genres: updatedGenres});
                                            }}
                                        />
                                        {genre.title}
                                    </label>
                                ))}
                            </div>
                        </div>
                        <button type="submit">Добавить книгу</button>
                    </form>
                )}
                
                {activeTab === 'authors' && (
                    <form onSubmit={handleAuthorSubmit} className={styles.form}>
                        <input
                            type="text"
                            placeholder="Имя автора"
                            value={authorForm.name}
                            onChange={(e) => setAuthorForm({...authorForm, name: e.target.value})}
                            required
                        />
                        <textarea
                            placeholder="Описание"
                            value={authorForm.description}
                            onChange={(e) => setAuthorForm({...authorForm, description: e.target.value})}
                            required
                        />
                        
                        <div className={styles.imageUpload}>
                            <label>Фото автора:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAuthorImageChange}
                                required
                            />
                            {authorPreview && (
                                <div className={styles.imagePreview}>
                                    <img src={authorPreview} alt="Preview" />
                                </div>
                            )}
                        </div>
                        <button type="submit">Добавить автора</button>
                    </form>
                )}
                
                {activeTab === 'genres' && (
                    <form onSubmit={handleGenreSubmit} className={styles.form}>
                        <input
                            type="text"
                            placeholder="Название жанра"
                            value={genreForm.title}
                            onChange={(e) => setGenreForm({...genreForm, title: e.target.value})}
                            required
                        />
                        <button type="submit">Добавить жанр</button>
                    </form>
                )}
            </div>
        );
    };

    return (
        <>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Админ-панель</h1>
                
                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tab} ${activeTab === 'books' ? styles.active : ''}`}
                        onClick={() => setActiveTab('books')}
                    >
                        Книги
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'authors' ? styles.active : ''}`}
                        onClick={() => setActiveTab('authors')}
                    >
                        Авторы
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'genres' ? styles.active : ''}`}
                        onClick={() => setActiveTab('genres')}
                    >
                        Жанры
                    </button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                {loading ? (
                    <div className={styles.loading}>Загрузка...</div>
                ) : (
                    <div className={styles.content}>
                        {renderForm()}

                        {/* Список записей */}
                        <div className={styles.listSection}>
                            <h2>Существующие записи</h2>
                            <div className={styles[cardsClass]}>
                                {activeTab === 'books' && books.map(book => (
                                    <div key={book.id} className={styles.card}>
                                        <img src={book.image} alt={book.title} className={styles.image} />
                                        <div className={styles.info}>
                                            <h3>{book.title}</h3>
                                            <p>{book.author}</p>
                                            <div className={styles.genres}>
                                                {book.genres?.map((genre, index) => (
                                                    <span key={index} className={styles.genre}>{genre}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className={styles.actions}>
                                            <button 
                                                className={styles.editBtn}
                                                onClick={() => startEdit('book', book)}
                                            >
                                                Изменить
                                            </button>
                                            <button 
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete('book', book.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                {activeTab === 'authors' && authors.map(author => (
                                    <div key={author.id} className={styles.card}>
                                        <img src={author.image} alt={author.name} className={styles.image} />
                                        <div className={styles.info}>
                                            <h3>{author.name}</h3>
                                            <p className={styles.description}>
                                                {author.description?.substring(0, 100)}...
                                            </p>
                                        </div>
                                        <div className={styles.actions}>
                                            <button 
                                                className={styles.editBtn}
                                                onClick={() => startEdit('author', author)}
                                            >
                                                Изменить
                                            </button>
                                            <button 
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete('author', author.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                
                                {activeTab === 'genres' && genres.map(genre => (
                                    <div key={genre.id} className={styles.card}>
                                        <div className={styles.info}>
                                            <h3>{genre.title}</h3>
                                            <p>Книг: {genre.pages}</p>
                                        </div>
                                        <div className={styles.actions}>
                                            <button 
                                                className={styles.editBtn}
                                                onClick={() => startEdit('genre', genre)}
                                            >
                                                Изменить
                                            </button>
                                            <button 
                                                className={styles.deleteBtn}
                                                onClick={() => handleDelete('genre', genre.id)}
                                            >
                                                Удалить
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default AdminPanel;