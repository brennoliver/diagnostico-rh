const nodemailer = require('nodemailer');

const QUESTIONS = [
  'Como você avalia o clima organizacional da empresa atualmente?',
  'Como você avalia a comunicação entre líderes e colaboradores?',
  'Como você avalia o comprometimento da equipe?',
  'Quais desafios você percebe com maior frequência?',
  'Os colaboradores compreendem claramente os objetivos da empresa?',
  'Você acredita que os líderes estão preparados para desenvolver suas equipes?',
  'Como você avalia o alinhamento da equipe com os valores da empresa?',
  'Quais são os três maiores desafios da empresa atualmente?',
  'O que você espera que melhore após este trabalho?',
  'Quais comportamentos gostaria de ver mais presentes na equipe?',
  'Quais comportamentos precisam ser reduzidos ou eliminados?',
  'O que você considera inegociável dentro da cultura da empresa?',
  'Se pudesse mudar apenas uma coisa na empresa hoje, o que seria?',
  'Existe alguma informação que você considera importante para a construção deste trabalho?',
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { nome, cargo, data, answers } = req.body || {};

  const rows = QUESTIONS.map((q, i) => {
    const val = (answers?.[`q${i + 1}`] || '—')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
    return `<tr>
      <td style="padding:14px 16px;border-bottom:1px solid #e8f5ee;vertical-align:top;width:42%">
        <span style="font-size:10px;font-weight:700;letter-spacing:1px;color:#C89B3C;text-transform:uppercase">Pergunta ${i + 1}</span><br>
        <span style="font-size:13px;font-weight:700;color:#1A5C45;line-height:1.4">${q}</span>
      </td>
      <td style="padding:14px 16px;border-bottom:1px solid #e8f5ee;font-size:13px;color:#3D3D3D;line-height:1.7;vertical-align:top">${val}</td>
    </tr>`;
  }).join('');

  const html = `<div style="font-family:Arial,sans-serif;max-width:700px;margin:0 auto">
  <div style="background:#1A5C45;padding:28px 32px">
    <div style="font-size:9px;font-weight:700;letter-spacing:3px;color:#C89B3C;margin-bottom:8px">RH COM PROPÓSITO</div>
    <div style="font-size:22px;font-weight:700;color:white">Questionário de Diagnóstico</div>
  </div>
  <div style="background:#C89B3C;height:3px"></div>
  <table style="width:100%;border-collapse:collapse;background:#F2FAF6"><tr>
    <td style="padding:12px 32px;font-size:12px;color:#3D3D3D"><b>Nome:</b> ${nome || '—'}</td>
    <td style="padding:12px 16px;font-size:12px;color:#3D3D3D"><b>Cargo:</b> ${cargo || '—'}</td>
    <td style="padding:12px 16px;font-size:12px;color:#3D3D3D"><b>Data:</b> ${data || '—'}</td>
  </tr></table>
  <table style="width:100%;border-collapse:collapse;background:white">${rows}</table>
  <div style="background:#1A5C45;padding:16px 32px;text-align:center">
    <span style="font-size:11px;color:rgba(255,255,255,.5)">RH com Propósito — Questionário de Diagnóstico da Direção</span>
  </div>
</div>`;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"RH com Propósito" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: `[RH com Propósito] Diagnóstico — ${nome || 'Respondente'}${cargo ? ` (${cargo})` : ''}`,
      html,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Erro ao enviar email:', err.message);
    return res.status(500).json({ error: 'Falha no envio do email.' });
  }
};
