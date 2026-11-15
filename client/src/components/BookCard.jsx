import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';
import { Button } from './ui.jsx';

const Card = styled.article`
  display: flex;
  flex-direction: column;
  min-height: 260px;
  padding: 22px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  transition: transform .18s ease, box-shadow .18s ease;
  &:hover { transform: translateY(-3px); box-shadow: 0 15px 34px rgba(40,48,37,.07); }
`;
const CardTop = styled.div`display:flex;justify-content:space-between;align-items:center;gap:12px;`;
const Genre = styled.span`padding:5px 9px;border-radius:999px;background:#edf1e9;color:var(--green);font-size:11px;font-weight:800;`;
const Rating = styled.span`color:#a56d2c;font-size:13px;font-weight:800;white-space:nowrap;`;
const BookTitle = styled.h2`margin:18px 0 5px;font-family:Georgia,'Noto Serif KR',serif;font-size:23px;letter-spacing:-.035em;`;
const Author = styled.p`margin:0;color:var(--muted);font-size:13px;`;
const Review = styled.p`display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;margin:17px 0;color:#596058;font-size:13px;line-height:1.7;`;
const Meta = styled.div`display:flex;justify-content:space-between;gap:10px;margin-top:auto;padding-top:14px;border-top:1px solid var(--line);color:var(--muted);font-size:11px;`;
const Actions = styled.div`display:flex;gap:7px;margin-top:13px;`;
const SmallButton = styled(Button)`min-height:34px;padding:7px 10px;font-size:12px;`;

export default function BookCard({ record, currentUserId, onDelete, showUser = false }) {
  const isOwner = currentUserId && Number(currentUserId) === Number(record.user_id);
  const date = record.read_date ? String(record.read_date).slice(0, 10) : '날짜 미입력';

  return (
    <Card>
      <CardTop>
        <Genre>{record.genre || '장르 미분류'}</Genre>
        <Rating>{record.rating ? `★ ${record.rating}.0` : '별점 없음'}</Rating>
      </CardTop>
      <BookTitle>{record.book_title}</BookTitle>
      <Author>{record.author || '저자 미입력'}</Author>
      {record.review ? <Review>{record.review}</Review> : <Review>아직 독서 후기가 작성되지 않았습니다.</Review>}
      <Meta>
        <span><FiBookOpen style={{ verticalAlign: '-2px' }} /> {showUser ? `작성자 ${record.user_name}` : `회원 #${record.user_id}`}</span>
        <span>{date}</span>
      </Meta>
      {isOwner && (
        <Actions>
          <SmallButton as={Link} to={`/records/${record.record_id}/edit`} $variant="ghost"><FiEdit2 /> 수정</SmallButton>
          <SmallButton type="button" $variant="danger" onClick={() => onDelete(record.record_id)}><FiTrash2 /> 삭제</SmallButton>
        </Actions>
      )}
    </Card>
  );
}
