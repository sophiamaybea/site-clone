import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Julia’s World — Interactive Reconstruction Study',
  description: 'Independent non-commercial study of Julia Alvarenga’s interaction-rich café portfolio. Unaffiliated with the original creator.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
