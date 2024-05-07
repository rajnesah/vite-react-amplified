import React, { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import { post, ApiError } from 'aws-amplify/api';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { type AuthUser } from "aws-amplify/auth";
import { type UseAuthenticator } from "@aws-amplify/ui-react-core";
async function postTodo() {
    try {
        const restOperation = post({
            apiName: 'todoApi',
            path: '/todo',
            options: {
                body: {
                    message: 'Mow the lawn'
                }
            }
        });

        const { body } = await restOperation.response;
        const response = await body.json();

        console.log('POST call succeeded');
        console.log(response);
    } catch (error) {
        if (error instanceof ApiError) {
            if (error.response) {
                const {
                    statusCode,
                    // headers,
                    body
                } = error.response;
                console.error(`Received ${statusCode} error response with payload: ${body}`);
            }
            // Handle API errors not caused by HTTP response.
        }
    }
}

type AppProps = {
    signOut?: UseAuthenticator["signOut"]; //() => void;
    user?: AuthUser;
};

const App: React.FC<AppProps> = ({ signOut, user }) => {
  const [count, setCount] = useState(0)
  postTodo()
  console.log('User', user)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
        {user &&
          <>
            <Heading level={1}>Hello {user?.signInDetails?.loginId}</Heading>
            <Button onClick={signOut}>Sign out</Button>
          </>
        }
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default withAuthenticator(App);
