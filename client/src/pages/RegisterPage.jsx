import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, Button, Description, Field, FieldLabel, Page, Panel, TextInput, Title } from '../components/ui.jsx';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ user_name: '', email: '', password: '', passwordConfirm: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    if (form.password !== form.passwordConfirm) {
      setError('비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = { user_name: form.user_name, email: form.email, password: form.password };
      const { data } = await api.post('/auth/register', payload);
      login(data.token, data.user);
      navigate('/');
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page className="narrow-page">
      <Panel>
        <div className="form-heading"><FiBookOpen size={27} /><Title>Booklog 시작하기</Title><Description>회원가입하고 나만의 독서 기록을 남겨 보세요.</Description></div>
        {error && <Alert>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Field><FieldLabel htmlFor="user_name">이름</FieldLabel><TextInput id="user_name" name="user_name" value={form.user_name} onChange={handleChange} maxLength={30} required /></Field>
          <Field><FieldLabel htmlFor="email">이메일</FieldLabel><TextInput id="email" name="email" type="email" value={form.email} onChange={handleChange} maxLength={100} required /></Field>
          <Field><FieldLabel htmlFor="password">비밀번호 (8자 이상)</FieldLabel><TextInput id="password" name="password" type="password" autoComplete="new-password" value={form.password} onChange={handleChange} minLength={8} required /></Field>
          <Field><FieldLabel htmlFor="passwordConfirm">비밀번호 확인</FieldLabel><TextInput id="passwordConfirm" name="passwordConfirm" type="password" autoComplete="new-password" value={form.passwordConfirm} onChange={handleChange} minLength={8} required /></Field>
          <Button type="submit" $variant="primary" disabled={submitting} className="full-button">{submitting ? '가입 중...' : '회원가입'}</Button>
        </form>
        <p className="form-bottom">이미 계정이 있나요? <Link to="/login">로그인</Link></p>
      </Panel>
    </Page>
  );
}
