import {StyleSheet, ScrollView} from 'react-native';
import React from 'react';
import ParentCategoryButton from './ParentCategoryButton';

interface ParentCategoriesListProps {
  parentCategories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function ParentCategoriesList({
  parentCategories,
  selectedCategory,
  onSelectCategory,
}: ParentCategoriesListProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}>
      {parentCategories.map(item => (
        <ParentCategoryButton
          key={item}
          item={item}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  horizontalList: {
    marginBottom: 16,
    height: 50,
  },
});
