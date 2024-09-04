'use client';
import {
  TextFieldInput,
  TextFieldRoot,
  Button,
  CalloutRoot,
  CalloutText,
} from '@radix-ui/themes';
import SimpleMDE from 'react-simplemde-editor';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface IssueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<IssueForm>();
  const [error, setError] = useState('');

  return (
    <div className="max-w-xl ">
      {error && (
        <CalloutRoot color="red" className="mb-5">
          <CalloutText>{error}</CalloutText>
        </CalloutRoot>
      )}
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async data => {
          try {
            await axios.post('/api/issues', data);
            router.push('/issues');
          } catch (error) {
            setError('An unexpected error occurred. Please try again.');
          }
        })}
      >
        <TextFieldRoot>
          <TextFieldInput placeholder="Title" {...register('title')} />
        </TextFieldRoot>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMDE placeholder="Description" {...field} />
          )}
        ></Controller>
        <Button>Submit New Issue</Button>
      </form>
    </div>
  );
};

export default NewIssuePage;
