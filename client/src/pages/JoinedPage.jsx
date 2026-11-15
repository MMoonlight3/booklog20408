import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import BookCard from '../components/BookCard.jsx';
import { Alert, Description, Eyebrow, Page, PageIntro, Title } from '../components/ui.jsx';

export default function JoinedPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/records/joined')
      .then(({ data }) => setRecords(data.records))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Page>
      <PageIntro>
        <Eyebrow>JOINED RECORDS</Eyebrow>
        <Title>독서 기록 모아보기</Title>
        <Description>회원 정보와 독서 기록을 JOIN으로 연결해 작성자와 함께 보여줍니다.</Description>
      </PageIntro>
      <div className="join-note"><strong>JOIN 조회 메뉴</strong><span>users.user_id = reading_records.user_id</span></div>
      {error && <Alert>{error}</Alert>}
      {loading ? <div className="page-message">조회 중...</div> : records.length === 0 ? (
        <div className="empty-state"><h3>함께 나눌 독서 기록이 아직 없습니다.</h3><p>독서 기록을 작성하면 이곳에 표시됩니다.</p></div>
      ) : (
        <div className="record-grid">
          {records.map((record) => <BookCard key={record.record_id} record={record} showUser />)}
        </div>
      )}
    </Page>
  );
}
