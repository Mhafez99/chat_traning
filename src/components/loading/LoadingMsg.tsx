import {
  ColorRing,
  FallingLines,
  Oval,
  ThreeDots,
  Vortex,
} from 'react-loader-spinner';
export const Loader = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center w-full'>
      <ThreeDots
        height='50'
        width='50'
        radius='9'
        color='white'
        ariaLabel='three-dots-loading'
        wrapperStyle={{}}
        visible={true}
      />
    </div>
  );
};

export const LoaderDelete = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center w-full'>
      <FallingLines color='white' width='50' visible={true} />
    </div>
  );
};
export const LoaderDragAndDrop = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center w-full'>
      <Vortex
        visible={true}
        height='30'
        width='30'
        ariaLabel='vortex-loading'
        wrapperStyle={{}}
        wrapperClass='vortex-wrapper'
        colors={['red', 'green', 'blue', 'yellow', 'orange', 'purple']}
      />
    </div>
  );
};
export const LoaderFoldersAndChats = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center w-full'>
      <Oval
        height={80}
        width={80}
        color='#fff'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor='#000'
        strokeWidth={2}
        strokeWidthSecondary={2}
      />
    </div>
  );
};
export const LoaderRenameTitle = () => {
  return (
    <div className='h-full flex flex-col gap-y-4 items-center justify-center w-full'>
      <ColorRing
        visible={true}
        height='30'
        width='30'
        ariaLabel='blocks-loading'
        wrapperStyle={{}}
        wrapperClass='blocks-wrapper'
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
      />
    </div>
  );
};
