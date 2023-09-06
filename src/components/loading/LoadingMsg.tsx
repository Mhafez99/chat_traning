import { FallingLines, ThreeDots } from 'react-loader-spinner';
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
