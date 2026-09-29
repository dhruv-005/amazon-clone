import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NotFound from '@/components/common/NotFound';

export default function GlobalNotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-12">
        <NotFound />
      </main>
      <Footer />
    </>
  );
}
