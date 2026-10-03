import './global.css';

export const metadata = {
  title: {
    default: 'Journey Hub',
    template: '%s · Journey Hub',
  },
  description: 'A multi-team Next.js and Nx application starter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
