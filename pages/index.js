import Head from 'next/head'

export async function getStaticProps({ preview = false }) {
  let Parser = require('rss-parser');
  let parser = new Parser();
  let feed = await parser.parseURL('https://treelightasia.wordpress.com/feed/');
  let cats = feed.items.reduce((acc, item) => {
    const { categories } = item;
    acc = [ ...acc, ...categories ];
    return acc 
  }, []);
  return {
    props: { data: feed.items, cats: [ ...new Set(cats) ], preview },
  }
}

export default function Home({ data, cats }) {
  const first = data[0];
  const div = document.createElement('div');
  div.innerHTML = first['content:encoded'];
  const firstImage = div.getElementsByTagName('img')[0];
  var imgSrc = firstImage ? firstImage.src : "";
  console.log(imgSrc)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Treelight Studio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex justify-center items-center flex-col">
        <img src="https://cdn.statically.io/gh/muhaimincs/treelight-studio/main/logo-treelight.png" width="250px" height="98px" />
      </header>
      <div className="w-full">
        <div className="border-t border-b flex justify-center my-6">
          <ul className="divide-x flex space-x-6">
            {cats.map((cat) => {
              return (
                <li key={cat} className="first:pl-0 pl-3 text-center">{cat}</li>
              )
            })}
          </ul>
        </div>
      </div>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">

        <p className="mt-3 text-2xl">
          Get started by editing{' '}
          <code className="p-3 font-mono text-lg bg-gray-100 rounded-md">
            pages/index.js
          </code>
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Documentation &rarr;</h3>
            <p className="mt-4 text-xl">
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Learn &rarr;</h3>
            <p className="mt-4 text-xl">
              Learn about Next.js in an interactive course with quizzes!
            </p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/master/examples"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Examples &rarr;</h3>
            <p className="mt-4 text-xl">
              Discover and deploy boilerplate example Next.js projects.
            </p>
          </a>

          <a
            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Deploy &rarr;</h3>
            <p className="mt-4 text-xl">
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        Hidup adalah belajar
      </footer>
    </div>
  )
}
