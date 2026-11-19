require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const path = require('path');
const { buildSystemPrompt } = require('./prompts/onboarding');

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const COMPANY_NAME = process.env.COMPANY_NAME || 'Perusahaan Kami';

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * POST /api/chat
 * Body: {
 *   messages: [ { role: 'user'|'assistant', content: string }, ... ],
 *   employee: {
 *     name, role, department, startDate, manager, buddy
 *   }
 * }
 */
app.post('/api/chat', async (req, res) => {
  const { messages, employee } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const emp = employee || {
    name: 'Karyawan Baru',
    role: 'Staff',
    department: 'General',
    startDate: new Date().toLocaleDateString('id-ID'),
    manager: 'Manager',
    buddy: 'HR Team',
  };

  const systemPrompt = buildSystemPrompt(emp, COMPANY_NAME);

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ error: 'Gagal menghubungi AI. Coba lagi nanti.' });
  }
});

/**
 * POST /api/welcome
 * Returns a welcome message from the AI for a new employee.
 * Body: { employee: { name, role, department, startDate, manager, buddy } }
 */
app.post('/api/welcome', async (req, res) => {
  const { employee } = req.body;

  const emp = employee || {
    name: 'Karyawan Baru',
    role: 'Staff',
    department: 'General',
    startDate: new Date().toLocaleDateString('id-ID'),
    manager: 'Manager',
    buddy: 'HR Team',
  };

  const systemPrompt = buildSystemPrompt(emp, COMPANY_NAME);

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Tolong sambut aku sebagai karyawan baru. Nama saya ${emp.name}, bergabung sebagai ${emp.role} di tim ${emp.department}. Ini hari pertama saya!`,
        },
      ],
      temperature: 0.75,
      max_tokens: 512,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI error:', err.message);
    res.status(500).json({ error: 'Gagal memuat sambutan.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Onboarding Buddy AI running at http://localhost:${PORT}`);
});
