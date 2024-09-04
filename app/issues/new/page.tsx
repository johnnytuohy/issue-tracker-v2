'use client';
import { TextFieldInput, TextFieldRoot, Button } from '@radix-ui/themes';
import SimpleMDE from 'react-simplemde-editor';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import 'easymde/dist/easymde.min.css';
import { useRouter } from 'next/navigation';

interface IssueForm {
  title: string;
  description: string;
}

const NewIssuePage = () => {
  const router = useRouter();
  const { register, control, handleSubmit } = useForm<IssueForm>();

  return (
    <form
      className="max-w-xl space-y-3"
      onSubmit={handleSubmit(async data => {
        await axios.post('/api/issues', data);
        router.push('/issues');
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
  );
};

export default NewIssuePage;
