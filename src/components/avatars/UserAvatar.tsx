import React from 'react';
import Image from 'next/image';
import userAvatar from '/public/userAvatar.png';
const UserAvatar = () => {
  return (
    <div className='flex items-center ml-2'>
      <Image src={userAvatar} width={30} height={30} alt='user' />
    </div>
  );
};

export default UserAvatar;
