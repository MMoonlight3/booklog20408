import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiBookOpen, FiPlus, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from './context/AuthContext.jsx';
import { Button } from './components/ui.jsx';

const Shell = styled.div`min-height:100vh;display:flex;flex-direction:column;`;
const Header = styled.header`position:sticky;top:0;z-index:10;border-bottom:1px solid rgba(220,222,211,.9);background:rgba(250,249,245,.92);backdrop-filter:blur(14px);`;
const HeaderInner = styled.div`width:min(1120px,calc(100% - 40px));min-height:74px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:20px;@media(max-width:700px){width:calc(100% - 28px);flex-wrap:wrap;padding:13px 0;}`;
const Brand = styled(Link)`display:flex;align-items:center;gap:10px;color:var(--green);font-family:Georgia,serif;font-size:26px;font-weight:700;letter-spacing:-.06em;text-decoration:none;`;
const Nav = styled.nav`display:flex;align-items:center;gap:18px;@media(max-width:700px){order:3;width:100%;overflow-x:auto;gap:15px;padding:5px 0;}`;
const NavItem = styled(NavLink)`color:var(--muted);font-size:13px;font-weight:700;text-decoration:none;white-space:nowrap;&.active{color:var(--green);}`;
const HeaderActions = styled.div`display:flex;align-items:center;gap:8px;`;
const UserName = styled.span`color:var(--muted);font-size:12px;@media(max-width:850px){display:none;}`;
const Footer = styled.footer`margin-top:auto;padding:25px 20px;border-top:1px solid var(--line);color:#8a9087;text-align:center;font-size:11px;`;

export default function Layout() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <Shell>
      <Header>
        <HeaderInner>
          <Brand to="/"><FiBookOpen size={23} /> booklog</Brand>
          <Nav>
            <NavItem to="/" end>전체 기록</NavItem>
            <NavItem to="/joined">독서 기록 모아보기</NavItem>
            {isLoggedIn && <NavItem to="/mypage">마이페이지</NavItem>}
          </Nav>
          <HeaderActions>
            {isLoggedIn ? (
              <>
                <UserName>{user?.user_name}님</UserName>
                <Button as={Link} to="/records/new" $variant="primary"><FiPlus /> 기록 작성</Button>
                <Button type="button" onClick={handleLogout} $variant="ghost" aria-label="로그아웃"><FiLogOut /></Button>
              </>
            ) : (
              <>
                <Button as={Link} to="/login" $variant="ghost">로그인</Button>
                <Button as={Link} to="/register" $variant="primary"><FiUser /> 회원가입</Button>
              </>
            )}
          </HeaderActions>
        </HeaderInner>
      </Header>
      <Outlet />
      <Footer>BOOKLOG · 읽은 책을 기록하고 서로의 생각을 나누는 공간</Footer>
    </Shell>
  );
}
