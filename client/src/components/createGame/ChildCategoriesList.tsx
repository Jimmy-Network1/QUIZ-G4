import {StyleSheet, View} from 'react-native';
import React from 'react';
import {CategoryInterface} from '../../types/categories';
import CategoryCard from './CategoryCard';

interface ChildCategoriesListProps {
  categories: CategoryInterface[];
  selectedCategory: CategoryInterface | null;
  onSelectCategory: (category: CategoryInterface) => void;
}

export default function ChildCategoriesList({
  categories,
  selectedCategory,
  onSelectCategory,
}: ChildCategoriesListProps) {
  return (
    <View style={styles.verticalList}>
      {categories.map(item => (
        <CategoryCard
          key={item.id.toString()}
          category={item}
          isSelected={selectedCategory?.id === item.id}
          onSelect={onSelectCategory}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  verticalList: {
    paddingBottom: 16,
  },
});
