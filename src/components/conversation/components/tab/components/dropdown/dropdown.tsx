import { SubmitHandler, useForm } from 'react-hook-form';
import { Config } from '@/interfaces/config.interface';
import TextareaAutosize from 'react-textarea-autosize';
import Chat from '@/interfaces/chat.interface';
import { Dispatch, SetStateAction } from 'react';
import { useGlobalContext } from '@/services/context/GlobalContext';

type Props = {
  chat: Chat;
  setIsDropdownOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Dropdown({ chat, setIsDropdownOpen }: Props) {
  const { globalConfig, setChatConfig } = useGlobalContext()

  const options = ['gpt-3.5-turbo', 'gpt-3.5-turbo-16k', 'gpt-4', 'gpt-4-32k'];
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Config>({
    defaultValues: globalConfig,
  });

  const onSubmit: SubmitHandler<Config> = (data: Config) => {
    setChatConfig(data)
    setIsDropdownOpen(false);
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='fixed top-0 right-0 md:absolute md:top-10 md:right-0 z-10 flex flex-col justify-between w-screen h-full md:w-[412px] md:h-fit md:max-h-[620px] border rounded-md p-2 overflow-hidden shadow-2xl bg-primary-200 border-primary-300 text-black dark:bg-primary-700 dark:border-primary-800 dark:text-primary-200'>
      <input type='hidden' {...register('chatId')} value={chat.chatId} />
      <p className='pb-2 text-lg font-bold'>Global Configuration</p>
      <div className='flex flex-col gap-2 p-2 overflow-y-auto'>
        <div>
          <label
            htmlFor='systemMask'
            className='text-sm font-bold text-black dark:text-primary-200'>
            Default System Message
          </label>
          <TextareaAutosize
            className='resize-none w-full rounded-md outline-none py-1 px-2 leading-5 text-sm bg-primary-100 hover:bg-primary-300 focus:bg-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800'
            id='systemMask'
            rows={1}
            {...register('systemMask', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='model' className='text-sm font-bold'>
            Model
          </label>
          <select
            className='w-full rounded-md p-2 cursor-pointer bg-primary-100 dark:bg-primary-800'
            {...register('model', { required: true })}
            id='model'>
            {options.map((option) => (
              <option
                key={option}
                value={option}
                selected={ option === globalConfig.model }
              >
                {option}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor='temperature' className='text-sm font-bold'>
            Temperature:
            { globalConfig.temperature }
          </label>
          <p className='my-2 rounded-md py-1 px-2 text-xs bg-primary-300 dark:bg-primary-600'>
            What sampling temperature to use, between 0 and 2. Higher values
            like 0.8 will make the output more random, while lower values like
            0.2 will make it more focused and deterministic. We generally
            recommend altering this or top-p but not both.
          </p>
          <input
            className='w-full h-2 appearance-none outline-none opacity-70 cursor-pointer transition ease-in-out hover:opacity-100'
            type='range'
            id='temperature'
            min='0'
            max='2'
            step='0.1'
            {...register('temperature', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='topP' className='text-sm font-bold'>
            Top P:
            { globalConfig.topP }
          </label>
          <p className='my-2 rounded-md py-1 px-2 text-xs bg-primary-300 dark:bg-primary-600'>
            An alternative to sampling with temperature, called nucleus
            sampling, where the model considers the results of the tokens with
            top_p probability mass. So 0.1 means only the tokens comprising the
            top 10% probability mass are considered. We generally recommend
            altering this or temperature but not both.
          </p>
          <input
            className='w-full h-2 appearance-none outline-none opacity-70 cursor-pointer transition ease-in-out hover:opacity-100'
            type='range'
            id='topP'
            min='0'
            max='1'
            step='0.1'
            {...register('topP', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='n' className='text-sm font-bold'>
            n:
            { globalConfig.n }
          </label>
          <p className='my-2 rounded-md py-1 px-2 text-xs bg-primary-300 dark:bg-primary-600'>
            How many chat completion choices to generate for each input message.
          </p>
          <input
            className=' w-full rounded-md outline-none py-1 px-2 leading-5 text-sm bg-primary-100 hover:bg-primary-300 focus:bg-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800'
            type='number'
            id='n'
            min={1}
            step={1}
            {...register('n', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='maxTokens' className='text-sm font-bold'>
            Max Tokens:
            { globalConfig.maxTokens }
          </label>
          <p className='my-2 rounded-md py-1 px-2 text-xs bg-primary-300 dark:bg-primary-600'>
            The maximum number of tokens to generate in the chat completion. The
            total length of input tokens and generated tokens is limited by the
            model&#180;s context length.
          </p>
          <input
            className='w-full rounded-md outline-none py-1 px-2 leading-5 text-sm bg-primary-100 hover:bg-primary-300 focus:bg-primary-300 dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:bg-primary-800'
            type='number'
            id='maxTokens'
            min={1}
            step={1}
            {...register('maxTokens', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='presencePenalty' className='text-sm font-bold'>
            Presence Penalty:
            { globalConfig.presencePenalty }
          </label>
          <p className='my-2 rounded-md py-1 px-2 text-xs bg-primary-300 dark:bg-primary-600'>
            Number between -2.0 and 2.0. Positive values penalize new tokens
            based on whether they appear in the text so far, increasing the
            model&#180;s likelihood to talk about new topics.
          </p>
          <input
            className='w-full h-2 appearance-none outline-none opacity-70 cursor-pointer transition ease-in-out hover:opacity-100'
            type='range'
            id='presencePenalty'
            min='-2'
            max='2'
            step='0.1'
            {...register('presencePenalty', { required: true })}
          />
        </div>

        <div>
          <label htmlFor='frequencyPenalty' className='text-sm font-bold'>
            Frequency Penalty:
            { globalConfig.frequencyPenalty }
          </label>
          <p className='my-2 rounded-md py-1 px-2 text-xs bg-primary-300 dark:bg-primary-600'>
            Number between -2.0 and 2.0. Positive values penalize new tokens
            based on their existing frequency in the text so far, decreasing the
            model&#180;s likelihood to repeat the same line verbatim.
          </p>
          <input
            className='w-full h-2 appearance-none outline-none opacity-70 cursor-pointer transition ease-in-out hover:opacity-100'
            type='range'
            id='frequencyPenalty'
            min='-2'
            max='2'
            step='0.1'
            {...register('frequencyPenalty', { required: true })}
          />
        </div>
      </div>

      {/* Form Buttons */}
      <div className='flex gap-2 w-full py-2 text-primary-200'>
        {/* Cancel */}
        <button
          onClick={() => setIsDropdownOpen(false)}
          className='w-full rounded-lg px-4 py-2 shadow outline-none font-bold text-center bg-danger-100 hover:bg-danger-200'>
          Cancel
        </button>

        {/* Submit */}
        <button
          type='submit'
          className='w-full rounded-lg px-4 py-2 shadow outline-none font-bold bg-main-100 hover:bg-main-200'>
          Save
        </button>
      </div>
    </form>
  );
}
