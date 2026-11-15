import styled from 'styled-components';

export const Page = styled.main`
  width: min(1080px, calc(100% - 40px));
  margin: 0 auto;
  padding: 54px 0 88px;
  @media (max-width: 640px) { width: min(100% - 28px, 1080px); padding-top: 34px; }
`;

export const PageIntro = styled.div`
  margin-bottom: 28px;
`;

export const Eyebrow = styled.p`
  margin: 0 0 9px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: .14em;
  text-transform: uppercase;
`;

export const Title = styled.h1`
  margin: 0;
  color: var(--ink);
  font-family: Georgia, 'Noto Serif KR', serif;
  font-size: clamp(30px, 5vw, 46px);
  font-weight: 600;
  letter-spacing: -.045em;
  line-height: 1.2;
`;

export const Description = styled.p`
  margin: 12px 0 0;
  color: var(--muted);
  line-height: 1.7;
`;

export const Panel = styled.section`
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface);
  padding: 25px;
  box-shadow: 0 12px 35px rgba(40, 48, 37, .045);
  @media (max-width: 640px) { padding: 19px; }
`;

export const Button = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 42px;
  padding: 10px 16px;
  border: 1px solid ${({ $variant }) => $variant === 'ghost' ? 'var(--line)' : 'var(--green)'};
  border-radius: 10px;
  color: ${({ $variant }) => $variant === 'primary' ? '#fff' : $variant === 'danger' ? '#a33e32' : 'var(--ink)'};
  background: ${({ $variant }) => $variant === 'primary' ? 'var(--green)' : $variant === 'danger' ? '#fff5f2' : 'transparent'};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: transform .15s ease, background .15s ease;
  &:hover:not(:disabled) { transform: translateY(-1px); }
  &:disabled { cursor: not-allowed; opacity: .55; }
`;

export const Field = styled.div`
  display: grid;
  gap: 8px;
  margin-bottom: 17px;
`;

export const FieldLabel = styled.label`
  color: var(--ink);
  font-size: 13px;
  font-weight: 750;
`;

export const TextInput = styled.input`
  width: 100%;
  min-height: 46px;
  padding: 11px 13px;
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
  color: var(--ink);
  background: #fff;
  font: inherit;
  &:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(48, 79, 63, .1); }
`;

export const TextArea = styled.textarea`
  width: 100%;
  min-height: 140px;
  padding: 12px 13px;
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
  color: var(--ink);
  background: #fff;
  font: inherit;
  line-height: 1.65;
  resize: vertical;
  &:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(48, 79, 63, .1); }
`;

export const SelectInput = styled.select`
  width: 100%;
  min-height: 46px;
  padding: 10px 13px;
  border: 1px solid var(--line);
  border-radius: 10px;
  outline: none;
  color: var(--ink);
  background: #fff;
  font: inherit;
  &:focus { border-color: var(--green); box-shadow: 0 0 0 3px rgba(48, 79, 63, .1); }
`;

export const Alert = styled.p`
  margin: 0 0 16px;
  padding: 11px 13px;
  border-radius: 10px;
  color: ${({ $success }) => $success ? '#245b42' : '#9a3930'};
  background: ${({ $success }) => $success ? '#edf6ef' : '#fff0ed'};
  font-size: 13px;
  line-height: 1.5;
`;

export const InlineLink = styled.a`
  color: var(--green);
  font-weight: 750;
  text-decoration: underline;
  text-underline-offset: 3px;
`;

export const FormActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
`;
