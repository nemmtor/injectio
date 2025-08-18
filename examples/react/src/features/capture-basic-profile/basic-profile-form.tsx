import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export type BasicProfile = {
  firstName: string;
  lastName: string;
};

type Props = {
  id: string;
  profile?: BasicProfile;
  onSubmit: (data: BasicProfile) => void;
};

export const BasicProfileForm = ({ id, profile, onSubmit }: Props) => {
  const form = useForm<BasicProfile>({
    defaultValues: profile ?? {
      firstName: '',
      lastName: '',
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        id={id}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          disabled={form.formState.isSubmitSuccessful}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          disabled={form.formState.isSubmitSuccessful}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
