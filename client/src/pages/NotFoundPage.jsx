import { Link } from 'react-router-dom';
import { Button, Page, Panel, Title, Description } from '../components/ui.jsx';

export default function NotFoundPage() {
  return (
    <Page className="narrow-page">
      <Panel className="not-found">
        <Title>페이지를 찾을 수 없습니다.</Title>
        <Description>주소가 잘못되었거나 페이지가 이동했을 수 있습니다.</Description>
        <Button as={Link} to="/" $variant="primary">메인으로 이동</Button>
      </Panel>
    </Page>
  );
}
