import React, { useCallback, useContext, useRef, useState } from 'react';
import { SearchContext } from '../../App';
import styles from './Search.module.scss';
import deleteButton from '../../assets/img/deleteButton.svg';
import searchButton from '../../assets/img/search.svg';
import debounce from 'lodash.debounce';

const Search = () => {
  const [value, setValue] = useState('');
  const { setSearchValue } = useContext(SearchContext);
  const inputRef = useRef();
  const updateSearchValue = useCallback(
    debounce((str) => {
      setSearchValue(str);
    }, 1000),
    [],
  );
  const onClickClean = () => {
    setSearchValue('');
    setValue('');
    inputRef.current.focus();
    updateSearchValue();
  };

  return (
    <div className={styles.root}>
      <img src={searchButton} className={styles.icon} alt="searchButton" />
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => setSearchValue(event.target.value)}
        className={styles.input}
        placeholder="Поиск пиццы..."
      />
      {value && (
        <img
          onClick={onClickClean}
          src={deleteButton}
          alt="deleteButton"
          className={styles.delete}
        />
      )}
    </div>
  );
};

export default Search;
