import { GetStaticProps } from "next";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../type";

export const getStaticPaths = async() => {
  const query = `*[_type == "post"] {
    _id,
    slug {
      current
    }
  }`

  const posts = await sanityClient.fetch(query)

  const paths = posts.map((post: Post) => ({
    params: {
      slug: post.slug.current
    }
  }))

  return {
    paths,
    fallback: "blocking"
  }
}

  export const getStaticProps: GetStaticProps = async({params}) => {
    const  query = `*[_type == "post" && slug.current == $slug][0]{
      _id,
      _createdAt,
      title,
      description,
      slug,
      author -> {
        name,
        image
      },
      'comments': *[
        _type == "comment" &&
        post.ref == ^._id &&
        approved == true
      ],
      mainImage,
      slug,
      body
    }`

    const post = await sanityClient.fetch(query, {
      slug: params?.slug
    })

    if(!post) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        post
      },
      revalidate: 60, // 60秒後にcache update
    }
  }

interface Props {
  post: Post;
}

function Post({post}: Props) {

  console.log(post);

  return (
    <div className=" hover:scale:105">
      <img
        src={urlFor(post.mainImage).url()!}
        alt=""
        className="w-full h-40 object-cover"
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="text-xl font-light">{post._createdAt}</h2>
        <h2 className="text-xl font-light">{post.description}</h2>
      </article>
    </div>
  )
}

export default Post;

