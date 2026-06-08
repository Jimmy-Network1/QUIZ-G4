import {useEffect, useState} from 'react';
import axios from 'axios';
import {TRIVIA_CATEGORY_URL} from '../config';
import {CategoryInterface} from '../types/categories';
import {Alert} from 'react-native';

import {useAlert} from '../store/alertContext';

export default function useFetchTriviaCategories() {
  const [categories, setCategories] = useState<CategoryInterface[]>([]);
  const {showAlert} = useAlert();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const response = await axios.get(TRIVIA_CATEGORY_URL);
      const data = response.data;
      const fetchedCategories = data.trivia_categories.map((category: any) => ({
        id: category.id,
        name: category.name.replace(/Entertainment: |Science: /g, ''),
      }));
      setCategories(fetchedCategories);
    } catch (err) {
      showAlert({
        title: 'Hors-ligne ?',
        message: 'Impossible de charger les catégories en ligne. L\'app utilisera les thèmes locaux.',
        type: 'info',
      });
    }
  }

  return categories;
}
