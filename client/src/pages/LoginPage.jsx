import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBookOpen } from 'react-icons/fi';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, Button, Description, Field, FieldLabel, Page, Panel, TextInput, Title } from '../components/ui.jsx';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.token, data.user);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Page className="narrow-page">
      <Panel>
        <div className="form-heading"><FiBookOpen size={27} /><Title>다시 만나서 반가워요.</Title><Description>Booklog에 로그인하고 독서 기록을 이어가세요.</Description></div>
        {error && <Alert>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Field><FieldLabel htmlFor="email">이메일</FieldLabel><TextInput id="email" name="email" type="email" autoComplete="email" value={form.email} onChange={handleChange} required /></Field>
          <Field><FieldLabel htmlFor="password">비밀번호</FieldLabel><TextInput id="password" name="password" type="password" autoComplete="current-password" value={form.password} onChange={handleChange} required /></Field>
          <Button type="submit" $variant="primary" disabled={submitting} className="full-button">{submitting ? '로그인 중...' : '로그인'}</Button>
        </form>
        <p className="form-bottom">아직 회원이 아니신가요? <Link to="/register">회원가입</Link></p>
      </Panel>
    </Page>
  );
}
