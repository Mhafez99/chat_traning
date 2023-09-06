"use client";

import Link from "next/link";
import Image from "next/image";

import { useGlobalContext } from "@/services/context/GlobalContext";
import { useRef, useState, MouseEvent, useEffect } from "react";

import TypewritterComponent from "typewriter-effect";
import AuthenticationModal from "./authenticationModal/AuthenticationModall";
// import AuthenticationModal from "./authenticationModal/AuthenticationModal";

const LandingHero = () => {
  const { isAuthenticationModalOpen, setIsAuthenticationModalOpen } =
    useGlobalContext();
  type AuthenticationType = "Sign In" | "Register";
  const [authenticationType, setAuthenticationType] =
    useState<AuthenticationType>("Sign In");
  const ref = useRef<HTMLDivElement>(null);

  const openAuthenticationModal = (type: AuthenticationType) => {
    setAuthenticationType(type);
    setIsAuthenticationModalOpen(true);
  };

  const closeAuthenticationModal = () => {
    setIsAuthenticationModalOpen(false);
    setAuthenticationType("Sign In");
  };

  return (
    <>
      <nav className='p-4 bg-transparent flex items-center justify-between'>
        <Link href='/' className='flex items-center'>
          <h1 className='text-2xl font-bold text-white'>AI PLATFORM</h1>
        </Link>
        <div className='flex items-center gap-x-2'>
          <button
            onClick={() => openAuthenticationModal('Sign In')}
            className='bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mr-4'>
            Sign In
          </button>
          <button
            onClick={() => openAuthenticationModal('Register')}
            className='bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md'>
            Register
          </button>
        </div>
      </nav>
      <div className='text-white font-bold py-36 text-center space-y-5'>
        <div className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold'>
          <h1>The Best AI Tool For </h1>
          <div className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'>
            <TypewritterComponent
              options={{
                strings: ['Chatbot.', 'Conversations', 'Code Generation.'],
                autoStart: true,
                loop: true,
              }}
            />
          </div>
        </div>
        <div className='text-sm md:text-xl font-light text-zinic-400'>
          Create Content using AI 10x faster
        </div>
      </div>
      <div>
        {isAuthenticationModalOpen && (
          <div className='fixed inset-0 top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50'>
            <AuthenticationModal
              setIsAuthenticationModalOpen={setIsAuthenticationModalOpen}
              authenticationType={authenticationType}
              closeModal={closeAuthenticationModal}
              setAuthenticationType={setAuthenticationType}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default LandingHero;
