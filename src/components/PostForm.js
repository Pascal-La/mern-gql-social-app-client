import { gql, useMutation } from "@apollo/client";
import { Button, Form } from "semantic-ui-react";

import { FETCH_POSTS_QUERY } from "../utils/graphql";
import { useForm } from "../utils/hooks";

const PostForm = () => {
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      let data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      // Initially, it was way more simple :
      // data.getPosts = [result.data.createPost, ...data.getPosts];
      // but it wasn't working for some reason, so I had to assign
      // the object to a new one, then copy back in data

      const newObj = Object.assign({}, data);
      newObj.getPosts = [result.data.createPost, ...newObj.getPosts];
      data = newObj;
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.body = "";
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Créer un post</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi world!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
          />
          <Button type="submit" color="teal">
            Publier
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
};

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
