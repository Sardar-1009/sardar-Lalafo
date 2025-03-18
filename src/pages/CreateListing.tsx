import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createListing, getCategories, Category } from '../services/api';
import './CreateListing.css';

const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: 0,
    categoryId: '',
    imageUrl: 'https://mysleepyhead.com/media/catalog/product/4/t/4thaug_2ndhalf5934_green.jpg',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
 
      if (data.length === 0) {
        const initialCategories = ['Транспорт', 'Мебель', 'Техника'];
        const promises = initialCategories.map((name) => createCategory(name));
        const newCategories = await Promise.all(promises);
        setCategories(newCategories);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name as string]: name === 'price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryId) {
      alert('Пожалуйста, выберите категорию');
      return;
    }
    try {
      await createListing(form);
      navigate('/');
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Ошибка при создании объявления.');
    }
  };

  return (
    <Container maxWidth="sm" className="create-container">
      <Paper className="create-paper">
        <Typography variant="h4" gutterBottom className="create-title">
          Создать объявление
        </Typography>
        <form onSubmit={handleSubmit} className="create-form">
          <TextField
            label="Название"
            name="title"
            value={form.title}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            label="Описание"
            name="description"
            value={form.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            required
            variant="outlined"
          />
          <TextField
            label="Цена"
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <FormControl fullWidth margin="normal" required variant="outlined">
            <InputLabel>Категория</InputLabel>
            <Select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              label="Категория"
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Ссылка на картинку"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary" className="create-button">
            Создать
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateListing;