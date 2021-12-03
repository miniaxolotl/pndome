import BannerMasthead from '@components/layout/BannerMasthead';
import DefaultLayout from '@components/layout/DefaultLayout';
import React from 'react';
interface IndexProps {}

const Index = (props: IndexProps) => {
  return (
    <DefaultLayout>
      <BannerMasthead />
    </DefaultLayout>
  );
};

export default Index;
