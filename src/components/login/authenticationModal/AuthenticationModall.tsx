'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useRouter } from 'next/navigation';

import { signIn } from 'next-auth/react';
import { Toaster, toast } from 'react-hot-toast';

import { FieldValues, useForm } from 'react-hook-form';

interface Props {
  authenticationType: string;
  closeModal: any;
  setAuthenticationType: any;
  setIsAuthenticationModalOpen: any;
}

export default function AuthenticationModal({
  setIsAuthenticationModalOpen,
  authenticationType,
  closeModal,
  setAuthenticationType,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const goBack = () => {
    closeModal();
  };

  const logIn = async (data: FieldValues) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (!result?.error) {
        setIsAuthenticationModalOpen(false);
        toast.success('Successful');
        setTimeout(() => {
          router.push('/chats');
        }, 1000);
        reset();
      } else {
        throw new Error('failed');
      }
    } catch (error) {
      toast.error('Email Or Password Is Not Valid');
    } finally {
      setLoading(false);
    }
  };

  const registeration = async (data: FieldValues) => {
    setLoading(true);
    try {
      // send user to backend
      const user = data;
      const endpoint = '/api/registeration';
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user }),
      };
      const response = await fetch(endpoint, options);
      console.log(response);
      
      const userData = await response.json();
      console.log(response);
      if (response?.status === 200) {
        toast.success('Success Registration');
        setAuthenticationType('Sign In');
        reset();
      } else if (response.status === 409) {
        toast.error(userData.message);
      }
    } catch (error) {
      toast.error('Error Notification !');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FieldValues) => {
    console.log(data);
    if (authenticationType === 'Sign In') {
      logIn(data);
    } else if (authenticationType === 'Register') {
      registeration(data);
    }
  };

  return (
    <div className='bg-white dark:bg-[#202123] rounded-lg px-8 py-2 shadow-md max-w-md w-full text-black'>
      <button
        onClick={() => goBack()}
        type='button'
        className='absolute -top-50 -left-50 z-10'>
        <ChevronLeftIcon fontSize='large' />
      </button>

      <p className='py-4 text-4xl text-center'>{authenticationType}</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Registration/Sign In Form */}
        <div className='p-4'>
          <label className='p-2 text-sm font-bold ' htmlFor='email'>
            Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              minLength: {
                value: 5,
                message: 'Email must be at least 5 characters',
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
            className='mt-2 mb-4 mx-2 w-full border border-neutral-800 rounded-lg bg-[#40414F] px-4 py-2 shadow  focus:outline-none text-neutral-100 '
            type='email'
            id='email'
            name='email'
          />
          {errors.email && (
            <p className='text-red-500 ml-3'>{`${errors.email.message}`}</p>
          )}
          <label className='p-2 text-sm font-bold '>Password</label>
          <input
            {...register('password', {
              required: {
                value: true,
                message: 'Password is reqiured !',
              },
              minLength: {
                value: 8,
                message: 'Password must be more than or equal 8 characters',
              },
              maxLength: {
                value: 20,
                message: 'Password cannot exceed more than 20 characters',
              },
              pattern: {
                value: /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z@#$%^&*!]*$/,
                message:
                  ' Must include uppercase and lowercase letters , a number and  Optional For a special character',
              },
            })}
            className='mt-2 mb-4 mx-2 w-full border border-neutral-800 rounded-lg bg-[#40414F] px-4 py-2 shadow  focus:outline-none text-neutral-100 '
            type='password'
            id='password'
            name='password'
          />
          {errors.password && (
            <p className='text-red-500 ml-3'>{`${errors.password.message}`}</p>
          )}

          {/* Register Inputs */}
          {authenticationType === 'Register' && (
            <>
              <label className='p-2 text-sm font-bold '>Confirm Password</label>
              <input
                {...register('confirmPassword', {
                  required: 'Confirm Password is required',
                  validate: (value) =>
                    value === getValues('password') || 'Password Must Match',
                })}
                className='mt-2 mb-4 mx-2 w-full border border-neutral-800 rounded-lg bg-[#40414F] px-4 py-2 shadow text-neutral-100 focus:outline-none'
                type='password'
                id='confirmPassword'
                name='confirmPassword'
              />
              {errors.confirmPassword && (
                <p className='text-red-500 ml-3'>{`${errors.confirmPassword.message}`}</p>
              )}
              <label className='p-2 text-sm font-bold '>Username</label>
              <input
                {...register('username', {
                  required: {
                    value: true,
                    message: 'Username is reqiured !',
                  },
                  minLength: {
                    value: 3,
                    message: 'Password must be more than or equal 3 characters',
                  },
                })}
                className='mt-2 mb-4 mx-2 w-full border border-neutral-800 rounded-lg bg-[#40414F] px-4 py-2 shadow text-neutral-100 focus:outline-none'
                type='text'
                id='username'
                name='username'
              />
              {errors.username && (
                <p className='text-red-500 ml-3'>{`${errors.username.message}`}</p>
              )}
            </>
          )}
        </div>

        {/* Registration/Sign In Button */}
        {authenticationType === 'Sign In' ? (
          <>
            <button
              disabled={loading}
              type='submit'
              className='my-2 w-full rounded-lg border px-4 py-2 shadow focus:outline-none border-neutral-800 border-opacity-50 bg-white font-bold text-black hover:bg-neutral-200 disabled:bg-gray-500'>
              Sign In
            </button>
          </>
        ) : (
          <>
            <button
              disabled={loading}
              type='submit'
              className='my-2 w-full rounded-lg border px-4 py-2 shadow focus:outline-none border-neutral-800 border-opacity-50 bg-white font-bold text-black hover:bg-neutral-200 disabled:bg-gray-500'>
              Register
            </button>
          </>
        )}
      </form>

      <div className='relative mb-4'>
        <div className='absolute inset-0  flex items-center'>
          <div className='w-full border-t border-gray-300' />
        </div>
        <div className='relative flex justify-center text-sm'>
          <p className='bg-violet-500 px-2 text-gray-100'>Or continue with</p>
        </div>
      </div>

      <div className='flex justify-center items-center gap-3 w-full'>
        <button className='flex flex-auto cursor-pointer select-none items-center gap-3 rounded-md bg-[#343541] py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-700'>
          <GoogleIcon />
          <span>Google</span>
        </button>
        <button className='flex flex-auto cursor-pointer select-none items-center gap-3 rounded-md bg-[#343541] py-3 px-3 text-[14px] leading-3 text-white transition-colors duration-200 hover:bg-gray-700'>
          <GitHubIcon />
          <span>Github</span>
        </button>
      </div>

      {authenticationType === 'Sign In' ? (
        <>
          <p className='my-2 w-full text-center '>
            New to Chatbot?&nbsp;
            <span
              onClick={() => setAuthenticationType('Register')}
              className='decoration-from-font cursor-pointer hover:text-blue-300 hover:underline text-blue-700  '>
              Create a new Account
            </span>
          </p>
        </>
      ) : (
        <>
          <p
            onClick={() => setAuthenticationType('Sign In')}
            className='my-2 w-full text-center'>
            Already have an account.&nbsp;
            <span className='decoration-from-font text-blue-700 cursor-pointer hover:text-blue-300 hover:underline'>
              Sign In
            </span>
          </p>
        </>
      )}
      <Toaster position='top-center' />
    </div>
  );
}
