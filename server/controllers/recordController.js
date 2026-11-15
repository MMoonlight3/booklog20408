import pool from '../config/db.js';

function readRecordInput(body) {
  const bookTitle = String(body.book_title || '').trim();
  const author = String(body.author || '').trim();
  const genre = String(body.genre || '').trim();
  const review = String(body.review || '').trim();
  const ratingValue = body.rating === '' || body.rating === undefined || body.rating === null
    ? null
    : Number(body.rating);
  const readDate = body.read_date ? String(body.read_date) : null;

  if (!bookTitle || bookTitle.length > 100) {
    return { error: '책 제목은 1~100자로 입력해 주세요.' };
  }
  if (author.length > 50 || genre.length > 30) {
    return { error: '저자는 50자, 장르는 30자 이내로 입력해 주세요.' };
  }
  if (ratingValue !== null && (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5)) {
    return { error: '별점은 1~5점 중에서 선택해 주세요.' };
  }
  if (readDate && !/^\d{4}-\d{2}-\d{2}$/.test(readDate)) {
    return { error: '독서 날짜를 올바르게 입력해 주세요.' };
  }

  return {
    values: [bookTitle, author || null, genre || null, ratingValue, review || null, readDate]
  };
}

export async function getAllRecords(_req, res, next) {
  try {
    const [records] = await pool.execute(
      `SELECT record_id, user_id, book_title, author, genre, rating, review, read_date, created_at
       FROM reading_records
       ORDER BY created_at DESC, record_id DESC`
    );
    return res.json({ records });
  } catch (error) {
    return next(error);
  }
}

export async function getJoinedRecords(_req, res, next) {
  try {
    const [records] = await pool.execute(
      `SELECT
         users.user_id,
         users.user_name,
         reading_records.record_id,
         reading_records.book_title,
         reading_records.author,
         reading_records.genre,
         reading_records.rating,
         reading_records.review,
         reading_records.read_date,
         reading_records.created_at
       FROM users
       INNER JOIN reading_records
         ON users.user_id = reading_records.user_id
       ORDER BY reading_records.created_at DESC, reading_records.record_id DESC`
    );
    return res.json({ records });
  } catch (error) {
    return next(error);
  }
}

export async function getRecordById(req, res, next) {
  try {
    const recordId = Number(req.params.id);
    if (!Number.isInteger(recordId) || recordId < 1) {
      return res.status(400).json({ message: '올바르지 않은 독서 기록 번호입니다.' });
    }

    const [rows] = await pool.execute(
      `SELECT record_id, user_id, book_title, author, genre, rating, review, read_date, created_at
       FROM reading_records WHERE record_id = ? LIMIT 1`,
      [recordId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '독서 기록을 찾을 수 없습니다.' });
    }
    return res.json({ record: rows[0] });
  } catch (error) {
    return next(error);
  }
}

export async function createRecord(req, res, next) {
  try {
    const parsed = readRecordInput(req.body);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    const [result] = await pool.execute(
      `INSERT INTO reading_records
       (user_id, book_title, author, genre, rating, review, read_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [req.user.user_id, ...parsed.values]
    );

    const [rows] = await pool.execute(
      `SELECT record_id, user_id, book_title, author, genre, rating, review, read_date, created_at
       FROM reading_records WHERE record_id = ? LIMIT 1`,
      [result.insertId]
    );

    return res.status(201).json({ message: '독서 기록이 등록되었습니다.', record: rows[0] });
  } catch (error) {
    return next(error);
  }
}

export async function updateRecord(req, res, next) {
  try {
    const recordId = Number(req.params.id);
    if (!Number.isInteger(recordId) || recordId < 1) {
      return res.status(400).json({ message: '올바르지 않은 독서 기록 번호입니다.' });
    }

    const [existing] = await pool.execute(
      'SELECT user_id FROM reading_records WHERE record_id = ? LIMIT 1',
      [recordId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: '독서 기록을 찾을 수 없습니다.' });
    }
    if (Number(existing[0].user_id) !== req.user.user_id) {
      return res.status(403).json({ message: '본인이 작성한 기록만 수정할 수 있습니다.' });
    }

    const parsed = readRecordInput(req.body);
    if (parsed.error) {
      return res.status(400).json({ message: parsed.error });
    }

    await pool.execute(
      `UPDATE reading_records
       SET book_title = ?, author = ?, genre = ?, rating = ?, review = ?, read_date = ?
       WHERE record_id = ? AND user_id = ?`,
      [...parsed.values, recordId, req.user.user_id]
    );

    const [rows] = await pool.execute(
      `SELECT record_id, user_id, book_title, author, genre, rating, review, read_date, created_at
       FROM reading_records WHERE record_id = ? LIMIT 1`,
      [recordId]
    );
    return res.json({ message: '독서 기록이 수정되었습니다.', record: rows[0] });
  } catch (error) {
    return next(error);
  }
}

export async function deleteRecord(req, res, next) {
  try {
    const recordId = Number(req.params.id);
    if (!Number.isInteger(recordId) || recordId < 1) {
      return res.status(400).json({ message: '올바르지 않은 독서 기록 번호입니다.' });
    }

    const [existing] = await pool.execute(
      'SELECT user_id FROM reading_records WHERE record_id = ? LIMIT 1',
      [recordId]
    );
    if (existing.length === 0) {
      return res.status(404).json({ message: '독서 기록을 찾을 수 없습니다.' });
    }
    if (Number(existing[0].user_id) !== req.user.user_id) {
      return res.status(403).json({ message: '본인이 작성한 기록만 삭제할 수 있습니다.' });
    }

    await pool.execute(
      'DELETE FROM reading_records WHERE record_id = ? AND user_id = ?',
      [recordId, req.user.user_id]
    );
    return res.json({ message: '독서 기록이 삭제되었습니다.' });
  } catch (error) {
    return next(error);
  }
}
