import React, { useState, useRef, useCallback } from "react";
import usePosts from "../hooks/usePosts";
import Post from "../Post/Post";

const UnlimitedScroller = () => {
  const [pageNum, setPageNum] = useState(1);

  const { isLoading, isError, error, results, hasNextPage } = usePosts(pageNum);

  const intObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isLoading) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log("about last post");
          setPageNum((pre) => pre + 1);
        }
      });
      if (post) intObserver.current.observe(post);
    },
    [isLoading, hasNextPage]
  );

  if (isError) return <p>Error : {error.message}</p>;

  const content = results.map((post, i) => {
    if (results.length === i + 1) {
      return <Post ref={lastPostRef} key={post.id} post={post} />;
    }
    return <Post key={post.id} post={post} />;
  });

  return (
    <div className="post-container">
      {isLoading && <p>Loading ... </p>}
      {content}
      <p>
        <a href="#top">Top</a>
      </p>
    </div>
  );
};

export default UnlimitedScroller;
