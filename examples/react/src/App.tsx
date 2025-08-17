import { useAtom } from '@effect-atom/atom-react';
import { Button } from './components/ui/button';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from './components/ui/card';
import { startExample1 } from './examples/01';
import { startExample2 } from './examples/02';
import { startExample3 } from './examples/03';
import { startExample4 } from './examples/04';
import { startExample5 } from './examples/05';
import { startExample6 } from './examples/06';
import { createUserAtom } from './examples/07';
import { useSelectedUser } from './examples/08';

export const App = () => {
  const [createdUser, startExample7] = useAtom(createUserAtom);
  const selectedUser = useSelectedUser();

  console.log({ selectedUser });

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col space-y-4 w-full items-center">
        <ExampleCard
          title="Example #1"
          description="Simple stuff."
          onStartClick={startExample1}
        />
        <ExampleCard
          title="Example #2"
          description="Simple flow."
          onStartClick={startExample2}
        />
        <ExampleCard
          title="Example #3"
          description="Same as example #2 but this time finalizer will run after whole flow."
          onStartClick={startExample3}
        />
        <ExampleCard
          title="Example #4"
          description="With loader dialog while waiting for api response."
          onStartClick={startExample4}
        />
        <ExampleCard
          title="Example #5"
          description="More complex usecase with usage of updateProps to dynamically update the progress dialog"
          onStartClick={startExample5}
        />
        <ExampleCard
          title="Example #6"
          description="Same as example 6 but with retry."
          onStartClick={startExample6}
        />
        <ExampleCard
          title="Example #7"
          description={`With @effect-atom\n${JSON.stringify(createdUser, null, 4)}`}
          onStartClick={() => startExample7('John')}
        />
      </div>
    </div>
  );
};

const ExampleCard = (props: {
  title: string;
  description: string;
  onStartClick: VoidFunction;
}) => (
  <Card className="w-full max-w-sm">
    <CardHeader>
      <CardTitle>{props.title}</CardTitle>
      <CardDescription className="whitespace-pre-wrap">
        {props.description}
      </CardDescription>
      <CardAction>
        <Button variant="ghost" onClick={props.onStartClick}>
          Start
        </Button>
      </CardAction>
    </CardHeader>
  </Card>
);
