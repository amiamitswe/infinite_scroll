import React, { forwardRef } from "react";

const Post = forwardRef(({ post }, ref) => {
  const postBody = (
    <div className="posts">
      <p>{post.id}</p>
      <p>User: {post.userId}</p>
      <p>{post.title}</p>
      <p>{post.body}</p>
    </div>
  );

  const content = ref ? (
    <article ref={ref}>{postBody}</article>
  ) : (
    <article>{postBody}</article>
  );

  return content;
});

export default Post;
