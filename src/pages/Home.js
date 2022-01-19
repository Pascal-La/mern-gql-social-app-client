import { useQuery } from "@apollo/client";
import React, { useContext } from "react";
import { Grid, Transition } from "semantic-ui-react";

import { AuthContext } from "../context/auth";
import { FETCH_POSTS_QUERY } from "../utils/graphql";

import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";

const Home = () => {
  const { user } = useContext(AuthContext);
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);

  return (
    <>
      <Grid columns={2} centered>
        {user && (
          <Grid.Column>
            <PostForm />
          </Grid.Column>
        )}
      </Grid>
      <Grid columns={3}>
        <Grid.Row className="page-title">
          <h1>Recent posts</h1>
        </Grid.Row>
        <Grid.Row>
          {loading ? (
            <h1>Chargement des posts...</h1>
          ) : (
            <Transition.Group>
              {data &&
                data.getPosts.map((post) => (
                  <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </>
  );
};

export default Home;
