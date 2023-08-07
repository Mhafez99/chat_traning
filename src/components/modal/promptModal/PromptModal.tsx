"use client";

import { ChangeEvent, FormEvent, useState } from "react";

import { useGlobalContext } from "@/services/context/GlobalContext";

import Prompt from "@/interfaces/prompt.interface";

import Modal from "../Modal";

interface Props {
  prompt: Prompt;
}

export default function PromptModal({ prompt }: Props) {
  const { prompts, setPrompts, setIsPromptModalOpen } = useGlobalContext();
  const [updatedPrompt, setUpdatedPrompt] = useState(prompt);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUpdatedPrompt({ ...updatedPrompt, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdatedPrompt({
      ...prompt,
      [e.currentTarget.name]: e.currentTarget.value,
    });

    let updatedPrompts = [...prompts];
    updatedPrompts = updatedPrompts.map((prompt: Prompt) => {
      if (prompt.id === updatedPrompt.id) return updatedPrompt;
      return prompt;
    });

    setPrompts(updatedPrompts);
    setIsPromptModalOpen(false);
  };

  return (
    <form onSubmit={(event: FormEvent<HTMLFormElement>) => handleSubmit(event)}>
      <label className="text-sm font-bold text-neutral-200">Title</label>
      <input
        className="my-2 w-full border border-neutral-800 rounded-lg bg-[#40414F] px-4 py-2 shadow text-neutral-100 focus:outline-none"
        placeholder="A name for your prompt."
        id="title"
        name="title"
        onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event)}
        value={updatedPrompt.title}
      />

      <label className="mt-6 text-sm font-bold text-neutral-200">
        Description
      </label>
      <textarea
        className="my-2 w-full border border-neutral-800 rounded-lg bg-[#40414F] px-4 py-2 shadow text-neutral-100 focus:outline-none"
        placeholder="A description for your prompt."
        id="description"
        name="description"
        rows={3}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          handleChange(event)
        }
        value={updatedPrompt.description}
      />

      <label className="mt-6 text-sm font-bold text-neutral-200">Prompt</label>
      <textarea
        className="my-2 w-full border border-neutral-800 rounded-lg bg-[#40414F] px-4 py-2 shadow text-neutral-100 focus:outline-none"
        placeholder="Prompt content. Use {{}} to denote a variable. Ex: {{name}} is a {{adjective}} {{noun}}"
        rows={10}
        id="prompt"
        name="prompt"
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
          handleChange(event)
        }
        value={updatedPrompt.prompt}
      />

      <button
        type="submit"
        className="w-full px-4 py-2 mt-6 border rounded-lg shadow border-neutral-500 text-neutral-900 hover:bg-neutral-100 focus:outline-none dark:border-neutral-800 dark:border-opacity-50 dark:bg-white dark:text-black dark:hover:bg-neutral-300"
      >
        Save
      </button>
    </form>
  );
}
