'use client';

// import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import './globals.css';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

// export default function RootLayout({
//   children
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const queryClient = new QueryClient();
//   return (
//     <html lang='en' className='bg-slate-900'>
//       <QueryClientProvider client={queryClient}>
//         <body className={inter.className}>{children}</body>
//       </QueryClientProvider>
//     </html>
//   );
// }

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return <div className={inter.className}>{children}</div>;
}
