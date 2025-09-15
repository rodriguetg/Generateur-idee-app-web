import React from 'react';
import { motion } from 'framer-motion';
import { categories } from '../data/categories';

interface CategorySelectorProps {
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ selectedCategory, onCategorySelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((category, index) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
            ${selectedCategory === category.id
              ? 'border-purple-500 bg-purple-50 shadow-lg'
              : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
            }
          `}
          onClick={() => onCategorySelect(category.id)}
        >
          <div className="text-center">
            <div className="text-3xl mb-2">{category.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{category.name}</h3>
            <p className="text-xs text-gray-600 leading-tight">{category.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default CategorySelector;
