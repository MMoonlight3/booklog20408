import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookCard from '../components/BookCard.jsx';
import { Alert, Button, Description, Eyebrow, Page, PageIntro, Title } from '../components/ui.jsx';

export default function HomePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRecords = useCallback(async () => {
    try {
      setError('');
      const { data } = await api.get('/records');
      setRecords(data.records);
    } catch (requestError) {
      setError(getErrorMessage(requestError, '독서 기록을 불러오지 못했습니다.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadRecords(); }, [loadRecords]);

  async function handleDelete(recordId) {
    if (!window.confirm('이 독서 기록을 삭제할까요?')) return;
    try {
      await api.delete(`/records/${recordId}`);
      setRecords((current) => current.filter((record) => record.record_id !== recordId));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  }

  return (
    <Page>
      <PageIntro>
        <Eyebrow>READ · RECORD · SHARE</Eyebrow>
        <Title>읽은 책을 기록하고,<br />생각을 나눠 보세요.</Title>
        <Description>책 한 권에 담긴 각자의 생각이 모여 새로운 이야기가 됩니다.</Description>
      </PageIntro>
      <div className="section-heading">
        <div><h2>최근 독서 기록</h2><p>모든 회원이 작성한 기록을 모아 봅니다.</p></div>
        {user && <Button as={Link} to="/records/new" $variant="primary"><FiPlus /> 기록 남기기</Button>}
      </div>
      {error && <Alert>{error}</Alert>}
      {loading ? <div className="page-message">독서 기록을 불러오는 중...</div> : records.length === 0 ? (
        <div className="empty-state"><span>✦</span><h3>아직 등록된 독서 기록이 없어요.</h3><p>첫 번째 독서 기록을 남겨 보세요.</p>{user && <Button as={Link} to="/records/new" $variant="primary">첫 기록 작성하기</Button>}</div>
      ) : (
        <div className="record-grid">
          {records.map((record) => <BookCard key={record.record_id} record={record} currentUserId={user?.user_id} onDelete={handleDelete} />)}
        </div>
      )}
    </Page>
  );
}
