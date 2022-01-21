import Head from 'next/head'
import Link from 'next/link';
import Header from '../components/Header'
import { sanityClient, urlFor } from '../sanity'
import { Post } from '../type'

interface Props {
  posts: [Post]
}

export default function Home({posts}: Props) {
  console.log(posts);

  return (
    <div className="max-w-7xl mx-auto">
      <Head>
        <title>Next-Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <Header /> */}
      <div className='flex justify-between items-center bg-teal-600 border-y border-black py-10 lg:py-0'>
        <div className='px-10 space-y-5 text-white'>
          <h1 className='text-6xl max-w-xl font-serif'>
            <span className='underline decoration-white decoration-4'>
              Beardev
            </span>
          </h1>
          <h2>
            It's easy and free to post my thinking on any topic and connect with millions of renders.
          </h2>
        </div>

        <img src="https://accountabilitylab.org/wp-content/uploads/2020/03/Medium-logo.png"
          className='hidden md:inline-flex h-32 lg:h-full'
        />
      </div>

      {/* Posts */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md: gap-6 p-2 md:p-6'>
        {posts.map((post) => (
          <Link key={post._id} href={`/posts/${post.slug.current}`}>
            <div className='border rounded-lg group cursor-pointer'>
              <img
                className='h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out'
                src={urlFor(post.mainImage).url()!}
              />
              <div className='flex justify-between p-5 bg-white'>
                <div>
                  <p className='text-lg font-bold'>{post.title}</p>
                  <p className='text-xs'>
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className='h-12 w-12 rounded-full'
                  src={urlFor(post.author.image).url()!}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps = async() => {
  const query = `*[_type == "post"] {
    _id,
    title,
    slug,
    author -> {
      name,
      image
  },
    description,
    mainImage,
    slug
  }`;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts,
    }
  }
}
