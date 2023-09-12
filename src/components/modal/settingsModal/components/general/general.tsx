import { useGlobalContext } from '@/services/context/GlobalContext';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';

export default function General() {
  const { theme, toggleTheme, setIsSettingsModalOpen } = useGlobalContext();
  const options = ['dark', 'light'];
  const router = useRouter();
  const pathname = usePathname();

  const { register, handleSubmit } = useForm({
    defaultValues: { theme: theme || options[1] },
    values: { theme: theme },
  });

  const onSubmit = (data: any) => {
    toggleTheme(data.theme);
    setIsSettingsModalOpen(false);
    router.push(pathname);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col justify-between'>
      <div>
        <p className='pb-2 text-lg font-bold'>General</p>
        <p className='m-0 pb-2 text-sm font-bold'>Theme</p>
        <select
          className='w-full rounded-md p-2 cursor-pointer bg-primary-100 text-black dark:bg-primary-800 dark:text-primary-200'
          {...register('theme', { required: true })}>
          {options.map((option) => (
            <option key={option} selected={option === theme}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Form Buttons */}
      <div className='flex gap-2 w-full py-2 text-primary-200'>
        {/* Cancel */}
        <Link
          href={pathname}
          onClick={() => setIsSettingsModalOpen(false)}
          className='w-full rounded-lg px-4 py-2 shadow outline-none font-bold text-center  bg-red-800 hover:bg-red-900'>
          Cancel
        </Link>

        {/* Submit */}
        <button
          type='submit'
          className='w-full rounded-lg px-4 py-2 shadow outline-none font-bold  bg-blue-800 hover:bg-blue-900'>
          Save
        </button>
      </div>
    </form>
  );
}
