import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, Button, Description, Field, FieldLabel, FormActions, Page, PageIntro, Panel, SelectInput, TextArea, TextInput, Title } from '../components/ui.jsx';

const emptyForm = {
  book_title: '', author: '', genre: '', rating: '', review: '', read_date: ''
};

export default function RecordFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/records/${id}`)
      .then(({ data }) => {
        if (Number(data.record.user_id) !== Number(user?.user_id)) {
          setError('본인이 작성한 기록만 수정할 수 있습니다.');
          return;
        }
        setForm({
          book_title: data.record.book_title || '',
          author: data.record.author || '',
          genre: data.record.genre || '',
          rating: data.record.rating ?? '',
          review: data.record.review || '',
          read_date: data.record.read_date ? String(data.record.read_date).slice(0, 10) : ''
        });
      })
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, [id, isEdit, user?.user_id]);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const payload = { ...form, rating: form.rating === '' ? null : Number(form.rating) };
      if (isEdit) await api.put(`/records/${id}`, payload);
      else await api.post('/records', payload);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <div className="page-message">기록을 불러오는 중...</div>;

  return (
    <Page className="narrow-page">
      <PageIntro><p className="eyebrow">YOUR READING JOURNAL</p><Title>{isEdit ? '독서 기록 수정' : '새 독서 기록'}</Title><Description>책을 읽으며 느낀 점을 자유롭게 기록해 보세요.</Description></PageIntro>
      <Panel>
        {error && <Alert>{error}</Alert>}
        {!error && (
          <form onSubmit={handleSubmit}>
            <Field><FieldLabel htmlFor="book_title">책 제목 *</FieldLabel><TextInput id="book_title" name="book_title" value={form.book_title} onChange={handleChange} maxLength={100} required /></Field>
            <div className="two-fields">
              <Field><FieldLabel htmlFor="author">저자</FieldLabel><TextInput id="author" name="author" value={form.author} onChange={handleChange} maxLength={50} /></Field>
              <Field><FieldLabel htmlFor="genre">장르</FieldLabel><SelectInput id="genre" name="genre" value={form.genre} onChange={handleChange}><option value="">선택 안 함</option><option>소설</option><option>에세이</option><option>인문</option><option>과학</option><option>역사</option><option>자기계발</option><option>기타</option></SelectInput></Field>
            </div>
            <div className="two-fields">
              <Field><FieldLabel htmlFor="rating">별점</FieldLabel><SelectInput id="rating" name="rating" value={form.rating} onChange={handleChange}><option value="">선택 안 함</option><option value="5">5점</option><option value="4">4점</option><option value="3">3점</option><option value="2">2점</option><option value="1">1점</option></SelectInput></Field>
              <Field><FieldLabel htmlFor="read_date">읽은 날짜</FieldLabel><TextInput id="read_date" name="read_date" type="date" value={form.read_date} onChange={handleChange} /></Field>
            </div>
            <Field><FieldLabel htmlFor="review">독서 후기</FieldLabel><TextArea id="review" name="review" value={form.review} onChange={handleChange} maxLength={5000} placeholder="책을 읽고 떠오른 생각이나 기억에 남는 점을 적어 보세요." /></Field>
            <FormActions>
              <Button type="submit" $variant="primary" disabled={submitting}>{submitting ? '저장 중...' : isEdit ? '수정 완료' : '기록 등록'}</Button>
              <Button as={Link} to="/" $variant="ghost">취소</Button>
            </FormActions>
          </form>
        )}
      </Panel>
    </Page>
  );
}
