const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Rota teste
app.get('/', (req, res) => {
  res.json({ mensagem: 'API rodando!' });
});

// GET - Buscar todos os produtos
app.get('/livros', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('livros')
      .select('*');
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// GET - Buscar produto por ID
app.get('/livros/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('livros')
      .select('*')
      .eq('id', req.params.id)
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// POST - Criar novo produto
app.post('/livros', async (req, res) => {
  try {
    const { titulo, autor, ano_publicacao} = req.body;
    const { data, error } = await supabase
      .from('livros')
      .insert([{ titulo, autor, ano_publicacao}])
      .select();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// PUT - Atualizar produto
app.put('/livros/:id', async (req, res) => {
  try {
    const { titulo, autor, ano_publicacao } = req.body;
    const { data, error } = await supabase
      .from('livros')
      .update({ titulo, autor, ano_publicacao })
      .eq('id', req.params.id)
      .select();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

// DELETE - Deletar produto
app.delete('/livros/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('livros')
      .delete()
      .eq('id', req.params.id);
    if (error) throw error;
    res.json({ mensagem: 'Produto deletado' });
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});