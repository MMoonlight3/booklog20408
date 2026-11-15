import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert, Button, Description, Field, FieldLabel, FormActions, Page, PageIntro, Panel, TextInput, Title } from '../components/ui.jsx';

export default function MyPage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(() => ({ user_name: user?.user_name || '', email: user?.email || '' }));
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);


  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);
    try {
      const { data } = await api.patch('/users/me', form);
      updateUser(data.user);
      setMessage(data.message);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm('정말 탈퇴할까요? 회원 정보와 작성한 독서 기록이 함께 삭제됩니다.');
    if (!confirmed) return;
    try {
      await api.delete('/users/me');
      await logout();
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <Page className="narrow-page">
      <PageIntro><p className="eyebrow">MY PAGE</p><Title>마이페이지</Title><Description>회원 정보와 계정을 관리할 수 있습니다.</Description></PageIntro>
      <Panel>
        <p className="profile-id">회원 번호 #{user?.user_id}</p>
        {error && <Alert>{error}</Alert>}
        {message && <Alert $success>{message}</Alert>}
        <form onSubmit={handleSubmit}>
          <Field><FieldLabel htmlFor="user_name">이름</FieldLabel><TextInput id="user_name" name="user_name" value={form.user_name} onChange={handleChange} maxLength={30} required /></Field>
          <Field><FieldLabel htmlFor="email">이메일</FieldLabel><TextInput id="email" name="email" type="email" value={form.email} onChange={handleChange} maxLength={100} required /></Field>
          <FormActions><Button type="submit" $variant="primary" disabled={saving}>{saving ? '저장 중...' : '정보 수정'}</Button></FormActions>
        </form>
      </Panel>
      <Panel className="danger-panel">
        <h2>회원 탈퇴</h2>
        <p>탈퇴하면 계정과 작성한 독서 기록이 함께 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
        <Button type="button" $variant="danger" onClick={handleDeleteAccount}>회원 탈퇴</Button>
      </Panel>
    </Page>
  );
}
