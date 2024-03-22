import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/hooks';
import { Title } from '../components/Title';
import { fetchCards, fetchSearchCards } from '../redux/books-slice';
import { BookCard } from '../components/card/BookCard';
import { Tabs } from '../components/Tabs';
import { Subscribe } from '../components/Subscribe';
import { setAddFavorites, setDeleteFavorites, setBook } from '../redux/books-slice';
import { SimilarBooks } from '../components/SimilarBooks';

export function Book() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(state => state.books.isLoading);
  const error = useAppSelector(state => state.books.error);
  const activeTab = useAppSelector(state => state.tabs.value);
  const bookById = useAppSelector(state => state.books.book);

  const [active, setActive] = useState(false);
  const [cart, setCart] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const booksInCart = useAppSelector(state => state.books.bookCart);
  const booksFavorite = useAppSelector(state => state.books.bookFavorites);
  const booksSimilar = useAppSelector(state => state.books.bookSearch);

  const { isbn13 } = useParams<{ isbn13: string }>();

  useEffect(() => {
    if (isbn13) {
      dispatch(fetchCards(isbn13));
    }
  }, [isbn13]);

  useEffect(() => {
    if (isbn13) {
      dispatch(fetchSearchCards({ search: bookById.authors, pageNumber: '1' }));
    }
  }, [bookById]);

  useEffect(() => {
    if (booksInCart.length != 0) {
      booksInCart.forEach((item, index) => {
        if (item.isbn13 == isbn13) {
          setCart(!cart);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (booksFavorite.length != 0) {
      booksFavorite.forEach((item, index) => {
        if (item.isbn13 == isbn13) {
          setActive(!active);
        }
      });
    }
  }, []);

  function handleClickFavorite() {
    if (active) {
      dispatch(setDeleteFavorites(bookById.isbn13));
      setActive(false);
    } else {
      dispatch(setAddFavorites());
      setActive(true);
    }
  }

  function handleClickAddCart() {
    dispatch(setBook());
    setCart(true);
  }

  function handleClickDropDown() {
    setIsOpen(!isOpen);
  }

  function renderTabs() {
    switch (activeTab) {
      case 'tab1':
        return (
          <div className="w-75 mb-4" style={{ minHeight: '250px' }}>
            <p className="fs-4 fw-semibold">{bookById.desc}</p>
          </div>
        );
      case 'tab2':
        return (
          <div className="w-75" style={{ minHeight: '250px' }}>
            <p className="fs-4 fw-semibold">{bookById.authors}</p>
          </div>
        );
      case 'tab3':
        return (
          <div className="w-75" style={{ minHeight: '250px' }}>
            <p className="fs-4 fw-semibold">{bookById.publisher}</p>
          </div>
        );
      default:
        return null;
    }
  }

  function renderContent() {
    if (error) {
      return <h1 className="text-danger">Error: {error}</h1>;
    }
    if (isLoading) {
      return <h1>Loading...</h1>;
    }
    return (
      <>
        <Title title={bookById.title} />
        <BookCard
          book={{ ...bookById }}
          handleClickFavorite={handleClickFavorite}
          handleClickAddCart={handleClickAddCart}
          handleClickDropDown={handleClickDropDown}
          active={active}
          cart={cart}
          isOpen={isOpen}
        />
        <Tabs />
        {renderTabs()}
        <Subscribe />
        <SimilarBooks book={booksSimilar} title="Similar book" />
      </>
    );
  }

  return <>{renderContent()}</>;
}
