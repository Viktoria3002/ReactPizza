import React, { useContext, useRef } from 'react';
import { useState, useEffect } from 'react';
import { SearchContext } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import PizzaBlock from '../components/PizzaBlock';
import Skeleton from '../components/PizzaBlock/Skeleton';
import Pagination from '../components/Pagination/Pagination';
import { setChangeId, setCurrentPage, setFilter } from '../redux/slices/filterSlice';
import Sort, { sortingOn } from '../components/Sort';
import { setItems } from '../redux/slices/pizzaSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isSearch = useRef(false);
  const isMounted = useRef(false);

  const { sort, categoryId, currentPage } = useSelector((state) => state.filter);
  const items = useSelector((state) => state.pizza.items);
  const { searchValue } = useContext(SearchContext);
  const [isLoading, setIsLoading] = useState(true);

  const onChangePage = (number) => {
    dispatch(setCurrentPage(number));
  };

  const changeCategoryId = (id) => {
    dispatch(setChangeId(id));
  };

  const fetchPizzas = async () => {
    setIsLoading(true);

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';
    // fetch(
    //   `https://6660e04063e6a0189fe7caf8.mockapi.io/items?page=${currentPage}&1&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
    // )
    //   .then((res) => res.json())
    //   .then((arr) => {
    //     setItems(arr);
    //     setTimeout(() => {
    //       setIsLoading(false);
    //     }, 600);
    //   });

    //   axios
    //     .get(
    //       `https://6660e04063e6a0189fe7caf8.mockapi.io/items?page=${currentPage}&1&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
    //     )
    //     .then((res) => {
    //       setItems(res.data);
    //       setIsLoading(false);
    //     });
    // };

    try {
      const { data } = await axios.get(
        `https://6660e04063e6a0189fe7caf8.mockapi.io/items?page=${currentPage}&1&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`,
      );
      dispatch(setItems(data));
    } catch (error) {
      console.log('ERROR', error);
      alert('Ошибка в получении пицц');
    } finally {
      setIsLoading(false);
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (isMounted.current) {
      const queryString = qs.stringify({
        sortProperty: sort.sortProperty,
        categoryId,
        currentPage,
      });

      navigate(`?${queryString}`);
    }
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, currentPage]);

  useEffect(() => {
    if (window.location.search) {
      const params = qs.parse(window.location.search.substring(1));

      const sort = sortingOn.find((obj) => obj.sortProperty === params.sortProperty);

      dispatch(setFilter({ ...params, sort }));

      isSearch.current = true;
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isSearch.current) {
      fetchPizzas();
    }

    isSearch.current = false;
  }, [categoryId, sort.sortProperty, currentPage, searchValue]);

  const pizzas = items
    // .filter((obj) => {
    //   if (obj.title.toLowerCase().includes(searchValue.toLowerCase())) {
    //     return true;
    //   }
    //   return false;
    // })
    .map((obj) => <PizzaBlock key={obj.id} {...obj} />);

  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={changeCategoryId} />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
