import { useEffect, Fragment, useMemo } from 'react'
import Head from 'next/head'

import { getAllPostsForHome, getSiteInfo } from '../lib/api'

export async function getStaticProps({ preview = false }) {
  let Parser = require('rss-parser');
  let parser = new Parser();
  let feed = await parser.parseURL('https://treelightasia.com/index.php/feed/');
  let cats = feed.items.reduce((acc, item) => {
    const { categories } = item;
    acc = [ ...acc, ...categories ];
    return acc 
  }, []);
  // const jsdom = require("jsdom");
  // const { JSDOM } = jsdom;
  // const first = feed.items[0];
  // const dom = new JSDOM(first['content:encoded']);
  // const firstImage = dom.window.document.getElementsByTagName('img')[0];
  // const imgSrc = firstImage ? firstImage.src : "";
  // return {
  //   props: { data: feed.items, cats: [ ...new Set(cats) ], imgSrc, preview },
  // }
  const allPosts = await getAllPostsForHome(preview)
  const siteInfo = await getSiteInfo(preview)
  return {
    props: { data: allPosts, cats: [ ...new Set(cats) ], preview, siteInfo },
  }
}

export default function Home({ data, cats, imgSrc, siteInfo }) {
  // console.log(siteInfo)
  const renderData = useMemo(() => {
    if (!data) {
      return null;
    }
    return data.map((d,i) => {
      return (
        <div className={`border overflow-hidden ${i === 0 ? 'col-span-3 row-span-2 md:col-span-2':''} grid grid-cols-1`} key={d.id}>
          <div className={`relative z-10 px-4 pt-10 pb-3 bg-gradient-to-t from-black`}>
            <p className="text-sm font-medium text-white">{d.date}</p>
            <h2 class="text-xl font-semibold text-white sm:text-2xl sm:leading-7 md:text-3xl">{d.title.rendered}</h2>
          </div>
          {d.excerpt.rendered && (
            <div className="col-start-1 row-start-2 px-4">
              <div className="flex items-center text-sm font-medium my-5 sm:mt-2 sm:mb-4 prose">
                <div>{d.excerpt.rendered}</div>
              </div>
            </div>
          )}
          <div className="col-start-1 row-start-1 flex">
            <div class={`w-full ${i === 0 ? 'h-screen max-h-80':''} grid grid-cols-3 grid-rows-2 gap-2`}>
              <div className="relative col-span-3 row-span-2 col-span-2">
                <img className="absolute inset-0 w-full h-full object-cover bg-gray-100 sm:rounded-t" src={d.jetpack_featured_media_url} alt={d.title.rendered} loading="lazy" />
              </div>
            </div>
          </div>
        </div>
      )
    })
  }, [data]);
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
                <li key={cat} className="first:pl-0 pl-6 text-center">{cat}</li>
              )
            })}
          </ul>
        </div>
      </div>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="grid grid-cols-3 grid-rows-2 gap-2">
          {renderData}
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        Hidup adalah belajar
      </footer>
    </div>
  )
}
