import React from 'react';
import Image from 'next/image';
import botAvatart from '/public/botAvatar.png';
const BotAvatar = () => {
  return (
    <div className='flex items-center mr-2'>
      <Image src={botAvatart} width={30} height={30} alt='bot' />
    </div>
  );
};

export default BotAvatar;
