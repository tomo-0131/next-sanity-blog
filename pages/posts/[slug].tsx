import { GetStaticProps } from "next";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import PortableText from "react-portable-text";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../type";
interface Props {
  post: Post;
}

// form部分の型付け
interface FormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

function Post({post}: Props) {

  const [ submitted, setSubmitted ] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormInput>();

  const onSubmit: SubmitHandler<FormInput> = async(data) => {
    console.log(data);
    await fetch("/api/createComment", {
      method: 'POST',
      body: JSON.stringify(data)
    }).then(() => {
      console.log(data);
      setSubmitted(true)
    }).catch((err) => {
      console.log(err);
      setSubmitted(false);
    });
  }

  console.log(post);

  return (
    <div className=" hover:scale:105">
      <img
        // src={urlFor(post.mainImage).url()!}
        src={urlFor(post.mainImage).url()!}
        alt=""
        className="w-full h-40 object-cover"
      />

      <article className="max-w-3xl mx-auto p-5">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        {/* <h2 className="text-xl font-light">{post._createdAt}</h2> */}
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {post.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt=""
          />
          <p className="font-extralight text-sm">
            Blog post by
            <span className="text-green-700 ml-1">
              {post.author.name}
            </span>
            <span className="block">Published at { new Date(post._createdAt).toLocaleString()}</span>
          </p>
        </div>

        <div>
          <PortableText
            className="mt-7"
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            content={post.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5" {...props}/>
              ),
              h2: (props: any) => (
                <h2 className="text-2xl font-bold my-5" {...props}/>
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>

      <hr className="max-w-xl my-5 mx-auto border border-teal-500"/>

      {submitted ? (
        <div>
            <h3>
              コメントありがとうございます！
              <p>
                コメント承認後、下に表示されます！
              </p>
            </h3>
        </div>
      ) : (
      <form className='flex flex-col p-5 max-w-2xl mx-auto mb-10' onSubmit={handleSubmit(onSubmit)}>
        <h3 className="text-sm text-teal-500">この投稿は参考になりましたか?</h3>
        <h4 className="text-xl font-md">お気軽にコメントをお願いします!</h4>

        <hr className="py-3 mt-1" />

        <input {...register("_id")} value={post._id} type="hidden" />

        <label className="block mb-5">
          <span className="text-gray-700">Name</span>
          {/* blockで擬似改行 */}
          <input placeholder="John Doe" type='text' className="shadow border rounded py-2 px-3 block mt-1 form-input ring-yellow-500 w-full outline-none focus:ring" {...register("name", {required: true, maxLength: 20})}/>
        </label>

        <label className="block mb-5">
          <span className="text-gray-700">Email</span>
          <input placeholder="John Doe" type='email' className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring" {...register("email", {required: true,pattern: /^\S+@\S+$/i})}  />
        </label>

        <label className="block mb-5">
          <span className="text-gray-700">Comment</span>
          <textarea placeholder="John Doe" rows={8} className="shadow border rounded py-2 px-3 block ring-yellow-500 w-full outline-none focus:ring" {...register("comment", {required: true, max: 120})}/>
        </label>
        {/* formのバリデーションエラー表示 */}
        <div className="flex flex-col-5 p-5">
          {errors.name && (
            <span className="text-red-500"> - 名前欄の入力は必須です</span>
          )}
          {errors.email && (
            <span className="text-red-500"> - メール入力欄が不正です</span>
          )}
          {errors.comment && (
            <span className="text-red-500"> - コメント欄の入力は必須です</span>
          )}
        </div>
        <input type="submit" className="shadow bg-teal-500 hover:bg-teal-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 rounded cursor-pointer" />
      </form>
      )}
      {/* コメントエリア */}
      <div  className="flex flex-col p-10 my-10 max-w-2xl mx-auto shadow-teal-500 shadow space-y-2">
        <h3 className="text-3xl">Comments</h3>
        <hr className="pb-2" />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className="text-teal-500">{comment.name}</span> : {comment.comment}
            <span className="text-sm text-gray-500 float-right">
              {new Date(comment._createdAt).toLocaleString()}
            </span>
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Post;

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
        post._ref == ^._id &&
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
