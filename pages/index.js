import { useEffect, Fragment, useMemo } from 'react'
import { formatDistance } from 'date-fns'
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
    revalidate: 60
  }
}

export default function Home({ data, cats, imgSrc, siteInfo }) {
  // console.log(siteInfo)
  const articlePublishedTime = useMemo(() => {
    return new Date(data[0].date);
  }, [data]);
  const articleModifiedTime = useMemo(() => {
    return data[0].modified_gmt
    // return new Date(data[0].date);
  }, [data]);
  console.log(articleModifiedTime)
  const renderData = useMemo(() => {
    if (!data) {
      return null;
    }
    
    return data.map((d,i) => {
      const timeDistance = formatDistance(
        new Date(d.date),
        new Date(),
        { includeSeconds: true }
      );

      if (i === 0) {
        return (
          <div className="col-span-1 row-span-2" key={d.id}>
            <div className="flex flex-col h-full max-w-lg mx-auto bg-gray-800 rounded-lg">
              <img
                className="rounded-lg rounded-b-none"
                src={d.jetpack_featured_media_url}
                alt={d.title.rendered}
                loading="lazy"
              />
              <div className="px-4 flex justify-between -mt-4">
                <p className="inline-block ring-4 bg-red-500 ring-gray-800 rounded-full text-sm font-medium tracking-wide text-gray-100 px-3 pt-0.5 flex space-x-1 items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{timeDistance}</span>
                </p>
              </div>
              <div className="py-2 px-4">
                <h1 className="text-xl font-medium leading-6 tracking-wide text-gray-300 hover:text-blue-500 cursor-pointer">
                  {d.title.rendered}
                </h1>
                <p className="text-gray-400 font-normal leading-5 tracking-wide prose text-left">
                  {d.excerpt.rendered.replace(/(<([^>]+)>)/gi, "")}
                </p>
              </div>
            </div>
          </div>
        )
      } else if (i === 1 || i === 2) {
        return (
          <div
            className="col-span-1 row-span-1 flex items-center w-full px-4 py-10 bg-cover flex-col overflow-hidden relative rounded"
            style={{ backgroundImage: `url(${d.jetpack_featured_media_url})`}}
            key={d.id}>
            <div className="flex overflow-hidden relative rounded backdrop-filter backdrop-blur">
              <div className="max-w-md">
                <h2 className="font-semibold text-xl leading-7 mb-3">{d.title.rendered}</h2>
                <p className="text-gray-400 font-normal leading-5 tracking-wide prose text-left">
                  {d.excerpt.rendered.replace(/(<([^>]+)>)/gi, "")}
                </p>
              </div>
            </div>
          </div>
        )
      }
      return (
        <div className="border overflow-hidden grid grid-cols-1" key={d.id}>
          <div className="relative z-10 px-4 pt-10 pb-3 bg-gradient-to-t from-black">
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
            <div class="grid grid-cols-3 grid-rows-2 gap-2">
              <div className="relative row-span-2 col-span-2">
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
        <meta property="og:title" content="Tree Light Studio"/>
        <meta property="og:type" content="website"/>
        <meta property="og:description" content="Mendengar | Melihat | Memberitahu"/>
        <meta property="og:url" content="https://treelight.studio/"/>
        <meta property="og:site_name" content="Tree Light Studio"/>
        <meta property="og:image" content="/img/teaser.jpg" />
        <meta name="description" content="sebagai badan NGO yang memfokuskan kepada pembaharuan pemikiran Islam dan metadologinya untuk membolehkan Ummah menangani secara berkesan untuk menyampaikan cabaran dan menyumbang kepada kemajuan peradaban manusia"/>
		    <link rel="canonical" href="https://treelight.studio/" />
		    <meta property="og:site_name" content="Tree Light Studio - Mendengar | Melihat | Memberitahu" />
		    <meta property="og:type" content="article" />
		    <meta property="og:title" content="Tree Light Studio - Mendengar | Melihat | Memberitahu" />
		    <meta property="og:description" content="sebagai badan NGO yang memfokuskan kepada pembaharuan pemikiran Islam dan metadologinya untuk membolehkan Ummah menangani secara berkesan untuk menyampaikan cabaran dan menyumbang kepada kemajuan peradaban manusia" />
		    <meta property="og:url" content="https://treelight.studio/" />

		    <meta property="article:published_time" content={articlePublishedTime} />
		    <meta property="article:modified_time" content={articleModifiedTime} />

		    <meta name="twitter:card" content="summary" />
		    <meta name="twitter:domain" content="treelight.studio" />
		    <meta name="twitter:title" content="Tree Light Studio - Mendengar | Melihat | Memberitahu" />
		    <meta name="twitter:description" content="sebagai badan NGO yang memfokuskan kepada pembaharuan pemikiran Islam dan metadologinya untuk membolehkan Ummah menangani secara berkesan untuk menyampaikan cabaran dan menyumbang kepada kemajuan peradaban manusia" />
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
