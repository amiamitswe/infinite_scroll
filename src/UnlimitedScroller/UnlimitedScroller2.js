import React, { useRef, useCallback } from "react";
// import usePosts from "../hooks/usePosts";
import Post from "../Post/Post";
import { useInfiniteQuery } from "react-query";
import { getPostAPI } from "../api/axios";

const UnlimitedScroller2 = () => {
  const {
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    data,
    error,
  } = useInfiniteQuery("/posts", ({ pageParam = 1 }) => getPostAPI(pageParam), {
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length + 1 : undefined;
    },
  });

  const intObserver = useRef();
  const lastPostRef = useCallback(
    (post) => {
      if (isFetchingNextPage) return;
      if (intObserver.current) intObserver.current.disconnect();

      intObserver.current = new IntersectionObserver((posts) => {
        if (posts[0].isIntersecting && hasNextPage) {
          console.log("about last post");
          fetchNextPage();
        }
      });
      if (post) intObserver.current.observe(post);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (status === "error") return <p>Error : {error.message}</p>;

  const content = data?.pages?.map((pg) => {
    return pg?.map((post, i) => {
      if (pg.length === i + 1) {
        return <Post ref={lastPostRef} key={post.id} post={post} />;
      }
      return <Post key={post.id} post={post} />;
    });
  });

  return (
    <div className="post-container">
      {isFetchingNextPage && <p>Loading ... </p>}
      {content}
      <p>
        <a href="#top">Top</a>
      </p>
    </div>
  );
};

export default UnlimitedScroller2;
