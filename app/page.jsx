"use client"

import Link from 'next/link';
// import { Card } from 'components/card';
// import { RandomQuote } from 'components/random-quote';
// import { Markdown } from 'components/markdown';
// import { ContextAlert } from 'components/context-alert';
import { getNetlifyContext } from 'utils';
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from 'react';

const supabase = createClient(
  process.env.SUPABASE_DATABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const cards = [
    //{ text: 'Hello', linkText: 'someLink', href: '/' }
];

const contextExplainer = `
The card below is rendered on the server based on the value of \`process.env.CONTEXT\` 
([docs](https://docs.netlify.com/configure-builds/environment-variables/#build-metadata)):
`;

const preDynamicContentExplainer = `
The card content below is fetched by the client-side from \`/quotes/random\` (see file \`app/quotes/random/route.js\`) with a different quote shown on each page load:
`;

const postDynamicContentExplainer = `
On Netlify, Next.js Route Handlers are automatically deployed as [Serverless Functions](https://docs.netlify.com/functions/overview/).
Alternatively, you can add Serverless Functions to any site regardless of framework, with acccess to the [full context data](https://docs.netlify.com/functions/api/).

And as always with dynamic content, beware of layout shifts & flicker! (here, we aren't...)
`;

const ctx = getNetlifyContext();

export default function Page() {

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
      async function fetchUsers() {
          const { data, error } = await supabase.from('users').select('*');
          if (error) {
              console.error(error);
              setError(error);
          } else {
              console.log(`data: `, data)
              setUsers(data);
          }
      }

      fetchUsers();
  }, []);

    return (
        <main className="flex flex-col gap-8 sm:gap-16">
            <section className="flex flex-col items-start gap-3 sm:gap-4">
                {/* <ContextAlert /> */}
                <h1 className="mb-0">Nikos Next.js Demo on Netlify</h1>
                <p className="text-lg">Get started with Next.js and Netlify in seconds.</p>
                <Link
                    href="https://docs.netlify.com/frameworks/next-js/overview/"
                    className="btn btn-lg btn-primary sm:btn-wide"
                >
                    Read the Docs
                </Link>
            </section>
            <section className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Users</h2>
                {error && <p className="text-red-500">Failed to load users.</p>}
                <ul>
                    {users.map((user) => (
                        <li key={user.id}>{user.name}</li> // Assuming `name` is a field in your users table
                    ))}
                </ul>
            </section>
        </main>
    );
}
