import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Paper } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { getListings, updateListing, Listing } from '../services/api';
import './EditListing.css';

const EditListing: React.FC = () => {
  const { listingId } = useParams<{ listingId: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState<Listing | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allListings = await getListings();
        const listing = allListings.find((l) => l.id === listingId);
        setForm(listing || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [listingId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) =>
      prev ? { ...prev, [name]: name === 'price' ? Number(value) : value } : null
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !listingId) return;
    try {
      await updateListing(listingId, {
        title: form.title,
        description: form.description,
        price: form.price,
        categoryName: form.categoryName,
        imageUrl: form.imageUrl,
      });
      navigate(`/listing/${listingId}`);
    } catch (error) {
      console.error('Error updating listing:', error);
      alert('Ошибка при обновлении объявления.');
    }
  };

  if (!form) return <Typography>Объявление не найдено</Typography>;

  return (
    <Container maxWidth="sm" className="edit-container">
      <Paper className="edit-paper">
        <Typography variant="h4" gutterBottom className="edit-title">
          Редактировать объявление
        </Typography>
        <form onSubmit={handleSubmit} className="edit-form">
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
          <TextField
            label="Категория"
            name="categoryName"
            value={form.categoryName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            label="Ссылка на картинку"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <Button type="submit" variant="contained" color="primary" className="edit-button">
            Сохранить
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default EditListing;